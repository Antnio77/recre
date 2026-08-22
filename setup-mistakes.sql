-- Table qui retient les erreurs précises (pas juste le score global) pour
-- permettre le mode révision. Contrairement aux tables "classes", celle-ci
-- n'a pas besoin de fonctions sécurisées : chaque utilisateur ne gère que
-- ses propres erreurs, une policy RLS classique suffit (même principe que
-- la table "scores").

create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  game text not null,
  difficulty text not null,
  lang text not null default 'fr',
  item_key text not null,
  item_data jsonb not null,
  created_at timestamptz default now(),
  unique (user_id, game, item_key)
);

alter table public.mistakes enable row level security;

create policy "users manage their own mistakes"
on public.mistakes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.mistakes to authenticated;
