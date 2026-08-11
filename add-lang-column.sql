-- À exécuter une fois dans le SQL Editor de Supabase : ajoute la colonne
-- "lang" à la table "scores" existante, pour savoir si chaque partie a
-- été jouée en français ou en anglais (nécessaire pour le graphique
-- radar Français / Anglais / Mathématiques sur la page statistiques).

alter table public.scores add column if not exists lang text default 'fr';
