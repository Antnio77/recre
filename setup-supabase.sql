-- Table qui stocke les scores de chaque joueur pour chaque jeu
create table public.scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  game text not null,
  difficulty text not null,
  score int not null,
  total int not null,
  created_at timestamp with time zone default now()
);

-- Sécurité : chaque utilisateur ne peut voir/insérer que ses propres scores
alter table public.scores enable row level security;

create policy "Les utilisateurs voient leurs propres scores"
on public.scores for select
using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent enregistrer leurs propres scores"
on public.scores for insert
with check (auth.uid() = user_id);

-- Permissions de base : sans ça, même avec les policies RLS ci-dessus,
-- Supabase répond 403 car le rôle "authenticated" n'a pas le droit
-- d'accéder à la table.
grant usage on schema public to authenticated;
grant select, insert on public.scores to authenticated;
