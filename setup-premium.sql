-- Système de codes premium : tu crées des codes (ex. un par école, réutilisable
-- N fois), tu les distribues, et chaque utilisateur qui saisit un code valide
-- devient premium. Les codes ne sont JAMAIS exposés directement au client :
-- toute la vérification passe par une fonction Postgres sécurisée, donc un
-- utilisateur ne peut pas "deviner" ou lister les codes valides.

create table public.premium_codes (
  code text primary key,
  label text,
  max_redemptions int not null default 1,
  redemption_count int not null default 0,
  created_at timestamptz default now()
);

create table public.premium_status (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default true,
  code_used text,
  activated_at timestamptz default now()
);

alter table public.premium_codes enable row level security;
alter table public.premium_status enable row level security;

-- Personne ne peut lire la table des codes directement (ni via l'API,
-- ni via une clé anon) : aucune policy SELECT n'est créée sur premium_codes.
-- La seule façon de vérifier un code est d'appeler la fonction ci-dessous.

create policy "users can view their own premium status"
on public.premium_status for select
using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select on public.premium_status to authenticated;

-- Fonction appelée depuis le site pour saisir un code. "security definer"
-- veut dire qu'elle s'exécute avec les droits du propriétaire de la base
-- (donc peut lire/modifier premium_codes même si le client, lui, n'y a
-- aucun accès direct). Elle est atomique (FOR UPDATE) pour éviter qu'un
-- même code réutilisable soit redeem deux fois en même temps au-delà de
-- sa limite.
create or replace function public.redeem_premium_code(input_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_redemptions int;
  v_max int;
begin
  select redemption_count, max_redemptions into v_redemptions, v_max
  from public.premium_codes
  where code = input_code
  for update;

  if not found then
    return false;
  end if;

  if v_redemptions >= v_max then
    return false;
  end if;

  update public.premium_codes
  set redemption_count = redemption_count + 1
  where code = input_code;

  insert into public.premium_status (user_id, is_premium, code_used, activated_at)
  values (auth.uid(), true, input_code, now())
  on conflict (user_id) do update
    set is_premium = true, code_used = input_code, activated_at = now();

  return true;
end;
$$;

grant execute on function public.redeem_premium_code(text) to authenticated;

-- Exemple pour créer un code utilisable par toute une école (30 élèves) :
-- insert into public.premium_codes (code, label, max_redemptions)
-- values ('ECOLE-DUPONT-2026', 'École Dupont - année 2025/2026', 30);
