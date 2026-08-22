-- Corrige l'erreur "Returned type character varying(255) does not match
-- expected type text" : la colonne email de auth.users est un varchar,
-- pas un text — Postgres exige une correspondance exacte de type dans
-- une fonction RETURNS TABLE, il faut donc caster explicitement.

drop function if exists public.get_class_details(uuid);
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
