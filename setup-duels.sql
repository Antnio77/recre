-- Mode Duel 1v1 : "Calcul mental éclair" face à un ami, par code d'invitation
-- (comme les codes premium : l'hôte crée la partie, obtient un code court
-- à donner à son adversaire, qui le saisit pour rejoindre).
--
-- Les deux joueurs jouent en parallèle (pas tour par tour) sur exactement
-- les mêmes calculs ; chacun voit le score de l'autre progresser en direct
-- via Supabase Realtime. Le jeu de questions est généré côté client (par
-- l'hôte, à partir du même pool JS que la partie solo dans
-- script-calcul-mental.js) puis figé en base pour que les deux joueurs
-- voient exactement les mêmes calculs, dans le même ordre.
--
-- Contrairement aux classes/codes premium, aucune donnée ici n'est
-- confidentielle une fois la partie rejointe (juste une difficulté, deux
-- pseudos, deux scores) donc on autorise une lecture directe (RLS) en plus
-- des fonctions sécurisées, ce qui permet à Supabase Realtime de pousser
-- les mises à jour en direct aux deux joueurs (Realtime respecte les
-- policies RLS ; sans policy de lecture, aucun évènement ne serait jamais
-- livré). Avant d'avoir rejoint, personne ne peut lire la ligne : tout
-- passe par le code, jamais par une recherche/liste des parties en cours.

create table if not exists public.duels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  game text not null default 'calcul-mental',
  difficulty text not null,
  questions jsonb not null,
  host_user_id uuid references auth.users(id) on delete cascade not null,
  host_name text not null,
  guest_user_id uuid references auth.users(id) on delete cascade,
  guest_name text,
  host_ready boolean not null default false,
  guest_ready boolean not null default false,
  host_score int not null default 0,
  guest_score int not null default 0,
  host_finished boolean not null default false,
  guest_finished boolean not null default false,
  status text not null default 'waiting' check (status in ('waiting', 'in_progress', 'finished')),
  created_at timestamptz not null default now(),
  started_at timestamptz
);

-- Index de la question affichée aux deux joueurs en ce moment, et indicateurs
-- "prêt pour la suite" par joueur : la question suivante ne s'affiche à
-- personne tant que les deux ne l'ont pas validée (voir advance_duel_round
-- plus bas). Ajoutés en "add column if not exists" pour rester compatible
-- avec une table déjà créée par une version précédente de ce script.
alter table public.duels add column if not exists current_question int not null default 0;
alter table public.duels add column if not exists host_next_ready boolean not null default false;
alter table public.duels add column if not exists guest_next_ready boolean not null default false;

alter table public.duels enable row level security;

-- Seuls les deux participants (une fois qu'ils ont rejoint via le code)
-- peuvent lire la ligne. Pas de policy "lobby ouvert" : impossible de
-- lister ou deviner une partie sans avoir le code.
drop policy if exists "participants can view their duel" on public.duels;
create policy "participants can view their duel"
on public.duels for select
using (auth.uid() = host_user_id or auth.uid() = guest_user_id);

grant usage on schema public to authenticated;
grant select on public.duels to authenticated;

-- Active Supabase Realtime sur cette table (pousse les UPDATE aux deux
-- joueurs abonnés : arrivée de l'adversaire, prêt, score qui progresse...).
-- Protégé par un test d'existence : "alter publication ... add table" plante
-- si la table est déjà membre de la publication (par ex. si ce script est
-- relancé après un premier passage partiellement réussi).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'duels'
  ) then
    alter publication supabase_realtime add table public.duels;
  end if;
end $$;

-- Crée un duel et renvoie son id + son code à donner à l'adversaire.
-- p_questions est le tableau de questions {expr, answer} déjà échantillonné
-- côté client (même pool que le solo) — on ne le régénère pas côté serveur
-- pour rester simple, comme le reste du site fait déjà confiance au client
-- pour le contenu des parties.
create or replace function public.create_duel(p_difficulty text, p_questions jsonb)
returns table(id uuid, code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text;
  v_code text;
  v_alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- sans 0/O/1/I/L (ambigus à l'oral/à l'écrit)
  v_attempt int := 0;
begin
  select coalesce(raw_user_meta_data ->> 'name', split_part(email::text, '@', 1))
  into v_name
  from auth.users u where u.id = auth.uid();

  loop
    v_code := '';
    for i in 1..6 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    v_attempt := v_attempt + 1;
    exit when not exists (select 1 from public.duels d where d.code = v_code) or v_attempt > 10;
  end loop;

  insert into public.duels (difficulty, questions, host_user_id, host_name, code)
  values (p_difficulty, p_questions, auth.uid(), v_name, v_code)
  returning duels.id into v_id;

  return query select v_id, v_code;
end;
$$;

grant execute on function public.create_duel(text, jsonb) to authenticated;

-- Rejoindre un duel via son code. La condition "guest_user_id is null" dans
-- le UPDATE suffit à empêcher deux personnes de rejoindre en même temps
-- (la deuxième requête ne trouvera plus la ligne dans cet état). Renvoie
-- l'id du duel rejoint, ou null si le code est invalide/déjà pris/complet.
create or replace function public.join_duel(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_id uuid;
begin
  select coalesce(raw_user_meta_data ->> 'name', split_part(email::text, '@', 1))
  into v_name
  from auth.users u where u.id = auth.uid();

  update public.duels
  set guest_user_id = auth.uid(), guest_name = v_name
  where code = upper(trim(p_code))
    and guest_user_id is null
    and host_user_id <> auth.uid()
    and status = 'waiting'
  returning duels.id into v_id;

  return v_id;
end;
$$;

grant execute on function public.join_duel(text) to authenticated;

-- Se déclarer prêt. Fait passer le duel en "in_progress" dès que les deux
-- joueurs le sont.
create or replace function public.set_duel_ready(p_duel_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.duels
  set host_ready = case when host_user_id = auth.uid() then true else host_ready end,
      guest_ready = case when guest_user_id = auth.uid() then true else guest_ready end
  where id = p_duel_id and (host_user_id = auth.uid() or guest_user_id = auth.uid());

  update public.duels
  set status = 'in_progress', started_at = now()
  where id = p_duel_id and host_ready and guest_ready and status = 'waiting';
end;
$$;

grant execute on function public.set_duel_ready(uuid) to authenticated;

-- Met à jour le score courant du joueur appelant (appelée après chaque
-- calcul, pas juste à la fin, pour un effet "score en direct"). Fait passer
-- le duel en "finished" dès que les deux joueurs ont terminé.
-- greatest(...) et "or" évitent qu'un rechargement de page en cours de
-- partie (qui repart de zéro côté client) ne fasse régresser un score ou
-- un statut "terminé" déjà enregistrés.
create or replace function public.update_duel_progress(p_duel_id uuid, p_score int, p_finished boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.duels
  set host_score = case when host_user_id = auth.uid() then greatest(host_score, p_score) else host_score end,
      host_finished = case when host_user_id = auth.uid() then (host_finished or p_finished) else host_finished end,
      guest_score = case when guest_user_id = auth.uid() then greatest(guest_score, p_score) else guest_score end,
      guest_finished = case when guest_user_id = auth.uid() then (guest_finished or p_finished) else guest_finished end
  where id = p_duel_id and (host_user_id = auth.uid() or guest_user_id = auth.uid());

  update public.duels
  set status = 'finished'
  where id = p_duel_id and host_finished and guest_finished and status = 'in_progress';
end;
$$;

grant execute on function public.update_duel_progress(uuid, int, boolean) to authenticated;

-- Le joueur appelant se déclare prêt à passer à la question suivante. Dès
-- que les DEUX joueurs se sont déclarés prêts, la partie avance d'un cran
-- pour tout le monde en même temps (current_question incrémenté, drapeaux
-- "prêt" remis à zéro) — c'est ce qui garde les deux joueurs synchronisés
-- question par question au lieu de laisser chacun avancer à son rythme.
-- Sur la toute dernière question, on ne dépasse pas la fin du tableau : le
-- duel passe directement en "finished" à la place.
create or replace function public.advance_duel_round(p_duel_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_len int;
  v_current int;
begin
  update public.duels
  set host_next_ready = case when host_user_id = auth.uid() then true else host_next_ready end,
      guest_next_ready = case when guest_user_id = auth.uid() then true else guest_next_ready end
  where id = p_duel_id and (host_user_id = auth.uid() or guest_user_id = auth.uid());

  select jsonb_array_length(questions), current_question into v_len, v_current
  from public.duels where id = p_duel_id;

  update public.duels
  set current_question = least(v_current + 1, v_len - 1),
      status = case when v_current + 1 >= v_len then 'finished' else status end,
      host_finished = case when v_current + 1 >= v_len then true else host_finished end,
      guest_finished = case when v_current + 1 >= v_len then true else guest_finished end,
      host_next_ready = false,
      guest_next_ready = false
  where id = p_duel_id and host_next_ready and guest_next_ready;
end;
$$;

grant execute on function public.advance_duel_round(uuid) to authenticated;
