-- Système de classes — 3 cas distincts, gérés par le type de code saisi :
--
-- 1. Code "premium"  → débloque juste le premium, pas de classe.
-- 2. Code "teacher"  → débloque le premium ET fait de la personne la prof
--                       de la classe liée à ce code (elle n'a rien à faire
--                       de plus, pas besoin de connaître son email à l'avance).
-- 3. Code "student"  → débloque le premium ET ajoute la personne comme
--                       élève de la classe liée à ce code.
--
-- Un même code prof + un même code élèves (réutilisable N fois) forment
-- une seule et même classe.

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  label text,
  teacher_user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.class_members (
  class_id uuid references public.classes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (class_id, user_id)
);

alter table public.classes enable row level security;
alter table public.class_members enable row level security;
-- Aucune policy de lecture directe : tout passe par les fonctions
-- sécurisées ci-dessous, comme pour les codes premium.

-- Ajoute le type de code et la classe associée à la table existante.
-- Les codes déjà créés avant cette mise à jour deviennent automatiquement
-- du type "premium" (comportement inchangé pour eux).
alter table public.premium_codes add column if not exists code_type text not null default 'premium'
  check (code_type in ('premium', 'teacher', 'student'));
alter table public.premium_codes add column if not exists class_id uuid references public.classes(id);

grant usage on schema public to authenticated;

-- Remplace la fonction de rédemption existante pour gérer les 3 cas.
create or replace function public.redeem_premium_code(input_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.premium_codes%rowtype;
begin
  select * into v_row
  from public.premium_codes
  where code = input_code
  for update;

  if not found then
    return false;
  end if;

  if v_row.redemption_count >= v_row.max_redemptions then
    return false;
  end if;

  update public.premium_codes
  set redemption_count = redemption_count + 1
  where code = input_code;

  insert into public.premium_status (user_id, is_premium, code_used, activated_at)
  values (auth.uid(), true, input_code, now())
  on conflict (user_id) do update
    set is_premium = true, code_used = input_code, activated_at = now();

  if v_row.code_type = 'teacher' and v_row.class_id is not null then
    update public.classes
    set teacher_user_id = auth.uid()
    where id = v_row.class_id;
  elsif v_row.code_type = 'student' and v_row.class_id is not null then
    insert into public.class_members (class_id, user_id)
    values (v_row.class_id, auth.uid())
    on conflict (class_id, user_id) do nothing;
  end if;

  return true;
end;
$$;

grant execute on function public.redeem_premium_code(text) to authenticated;

-- Classement de la classe (visible par tous les élèves qui en font partie,
-- et par la prof si elle veut jeter un œil).
drop function if exists public.get_classmates_leaderboard();
create or replace function public.get_classmates_leaderboard()
returns table(display_name text, total_xp numeric, is_me boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class_id uuid;
begin
  select class_id into v_class_id
  from public.class_members
  where user_id = auth.uid()
  limit 1;

  if v_class_id is null then
    select id into v_class_id
    from public.classes
    where teacher_user_id = auth.uid()
    limit 1;
  end if;

  if v_class_id is null then
    return;
  end if;

  return query
    select
      coalesce(u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)) as display_name,
      coalesce(sum(
        case s.difficulty
          when 'facile' then (s.score::numeric / nullif(s.total, 0)) * 10
          when 'moyen' then (s.score::numeric / nullif(s.total, 0)) * 20
          when 'difficile' then (s.score::numeric / nullif(s.total, 0)) * 35
          else (s.score::numeric / nullif(s.total, 0)) * 15
        end
      ), 0) as total_xp,
      (cm.user_id = auth.uid()) as is_me
    from public.class_members cm
    join auth.users u on u.id = cm.user_id
    left join public.scores s on s.user_id = cm.user_id
    where cm.class_id = v_class_id
    group by cm.user_id, u.email, u.raw_user_meta_data
    order by total_xp desc;
end;
$$;

grant execute on function public.get_classmates_leaderboard() to authenticated;

-- Liste des classes gérées par la prof connectée.
drop function if exists public.get_my_classes();
create or replace function public.get_my_classes()
returns table(class_id uuid, label text, student_count bigint)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select
      c.id,
      c.label,
      (select count(*) from public.class_members cm where cm.class_id = c.id)
    from public.classes c
    where c.teacher_user_id = auth.uid();
end;
$$;

grant execute on function public.get_my_classes() to authenticated;

-- Détail complet d'une classe (tous les élèves, toutes leurs parties) —
-- uniquement si l'appelant est bien la prof de cette classe précise.
drop function if exists public.get_class_details(text);
create or replace function public.get_class_details(p_class_id uuid)
returns table(
  student_email text,
  student_name text,
  game text,
  difficulty text,
  score int,
  total int,
  lang text,
  played_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.classes
    where id = p_class_id and teacher_user_id = auth.uid()
  ) then
    return;
  end if;

  return query
    select
      u.email::text,
      coalesce(u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1))::text,
      s.game, s.difficulty, s.score, s.total, s.lang, s.created_at
    from public.class_members cm
    join auth.users u on u.id = cm.user_id
    left join public.scores s on s.user_id = cm.user_id
    where cm.class_id = p_class_id
    order by u.email, s.created_at desc;
end;
$$;

grant execute on function public.get_class_details(uuid) to authenticated;

-- ============================================================
-- Exemple d'utilisation pour créer une classe complète (à adapter) :
-- ============================================================

-- 1. Crée la classe :
-- insert into public.classes (label) values ('École Dupont - CM2 2025/2026');

-- 2. Crée le code prof (normalement 1 seule utilisation) :
-- insert into public.premium_codes (code, label, code_type, class_id, max_redemptions)
-- select 'PROF-DUPONT-2026', 'École Dupont - Prof', 'teacher', id, 1
-- from public.classes where label = 'École Dupont - CM2 2025/2026';

-- 3. Crée le code élèves (réutilisable, ex. 30 fois pour 30 élèves) :
-- insert into public.premium_codes (code, label, code_type, class_id, max_redemptions)
-- select 'ELEVE-DUPONT-2026', 'École Dupont - Élèves', 'student', id, 30
-- from public.classes where label = 'École Dupont - CM2 2025/2026';

-- 4. Pour un client individuel qui ne veut que le premium (pas de classe) :
-- insert into public.premium_codes (code, label, max_redemptions)
-- values ('SOLO-MARIE-2026', 'Marie - client individuel', 1);
-- (code_type reste "premium" par défaut, class_id reste vide)
