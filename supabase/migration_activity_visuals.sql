-- Róża's Little Class — Activity Visuals migration
-- Purely additive: adds two nullable columns to lesson_steps and fills them
-- in for your five existing lessons. Nothing else is touched — lesson
-- content, order, songs, materials, session/response history all stay
-- exactly as they are.
--
-- Run this once in the Supabase SQL Editor, AFTER schema.sql and seed.sql
-- have already been run.

alter table lesson_steps add column if not exists activity_visual_key text;
alter table lesson_steps add column if not exists custom_visual_url text;

-- Assign the correct visual to each existing step, matched by its exact
-- text within each lesson (found via the lesson name), so this only
-- touches rows that already exist from seed.sql.

do $$
declare
  r record;
begin
  for r in
    select ls.id, l.name as lesson_name, ls.content
    from lesson_steps ls
    join lessons l on l.id = ls.lesson_id
  loop
    update lesson_steps set activity_visual_key = case

      -- My Name + Letter R
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Sing the Hello Song.' then 'hello-song'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Play the colour song and find colours together.' then 'song'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Show the full RÓŻA name card.' then 'show-name-card'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Match and arrange the individual letters to copy the name.' then 'arrange-letters'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Isolate R and say: "R is for Róża."' then 'show-letter'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Ask her to find R among a few other letters.' then 'find'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Decorate or trace a large R.' then 'trace'
      when r.lesson_name = 'My Name + Letter R' and r.content = 'Sing the Goodbye Song.' then 'goodbye-song'

      -- My Family
      when r.lesson_name = 'My Family' and r.content = 'Sing the Hello Song.' then 'hello-song'
      when r.lesson_name = 'My Family' and r.content = 'Play the family song.' then 'song'
      when r.lesson_name = 'My Family' and r.content = 'Look at each photo and name the person.' then 'look'
      when r.lesson_name = 'My Family' and r.content = 'Ask: "Where is Daddy?" "Where is Mummy?" "Where is Herkules?"' then 'point'
      when r.lesson_name = 'My Family' and r.content = 'Match each photo to its name card.' then 'match'
      when r.lesson_name = 'My Family' and r.content = 'Place the whole family together on the board.' then 'arrange'
      when r.lesson_name = 'My Family' and r.content = 'Optional: find R in RÓŻA and HERKULES.' then 'find'
      when r.lesson_name = 'My Family' and r.content = 'Sing the Goodbye Song.' then 'goodbye-song'

      -- Numbers 1–3
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Sing the Hello Song.' then 'hello-song'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Play Count and Move.' then 'song'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Count one, two and three objects together.' then 'count'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Ask: "Give me two."' then 'count'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Repeat with one and three.' then 'count'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Draw three circles and place one sticker in each.' then 'stickers'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Finish with one easy counting challenge using her favourite objects.' then 'count'
      when r.lesson_name = 'Numbers 1–3' and r.content = 'Sing the Goodbye Song.' then 'goodbye-song'

      -- Shapes
      when r.lesson_name = 'Shapes' and r.content = 'Sing the Hello Song.' then 'hello-song'
      when r.lesson_name = 'Shapes' and r.content = 'Play Shape Song #1.' then 'song'
      when r.lesson_name = 'Shapes' and r.content = 'Introduce only circle and square.' then 'shapes'
      when r.lesson_name = 'Shapes' and r.content = 'Draw each shape on the whiteboard.' then 'draw'
      when r.lesson_name = 'Shapes' and r.content = 'Trace the shapes together.' then 'trace'
      when r.lesson_name = 'Shapes' and r.content = 'Find one circle and one square around the room.' then 'find'
      when r.lesson_name = 'Shapes' and r.content = 'Match objects or stickers to the shape cards.' then 'match'
      when r.lesson_name = 'Shapes' and r.content = 'Sing the Goodbye Song.' then 'goodbye-song'

      -- Animals + Actions
      when r.lesson_name = 'Animals + Actions' and r.content = 'Sing the Hello Song.' then 'hello-song'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Play Walking in the Jungle.' then 'song'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Introduce frog, monkey and tiger.' then 'look'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Give each animal a movement: jump, swing or stomp.' then 'animal-action'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Call an animal and copy its movement together.' then 'animal-action'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Let Róża choose an animal for Mummy to act out.' then 'animal-action'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Repeat her favourite animal and action.' then 'animal-action'
      when r.lesson_name = 'Animals + Actions' and r.content = 'Sing the Goodbye Song.' then 'goodbye-song'

      else activity_visual_key -- leave untouched if it doesn't match (e.g. a step you've since edited)
    end
    where id = r.id;
  end loop;
end $$;

-- Storage bucket for optional custom (uploaded) visuals.
-- If this fails because the bucket already exists, that's fine — ignore the error.
insert into storage.buckets (id, name, public)
values ('lesson-visuals', 'lesson-visuals', true)
on conflict (id) do nothing;

-- Allow the signed-in user to manage files in their own folder within the bucket,
-- and allow public read (needed so the <img> tag in the app can display them).
drop policy if exists "lesson_visuals_read" on storage.objects;
create policy "lesson_visuals_read" on storage.objects
  for select using (bucket_id = 'lesson-visuals');

drop policy if exists "lesson_visuals_write" on storage.objects;
create policy "lesson_visuals_write" on storage.objects
  for insert with check (bucket_id = 'lesson-visuals' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "lesson_visuals_delete" on storage.objects;
create policy "lesson_visuals_delete" on storage.objects
  for delete using (bucket_id = 'lesson-visuals' and auth.uid()::text = (storage.foldername(name))[1]);
