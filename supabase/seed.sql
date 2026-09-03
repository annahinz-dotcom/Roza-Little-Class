-- Róża's Little Class — seed data
-- Run this AFTER schema.sql and AFTER you have created your login user
-- (Supabase Dashboard → Authentication → Users → Add user).
--
-- IMPORTANT: replace 'YOUR_EMAIL_HERE' below with the exact email address
-- of the user you created, then run this whole file in the SQL Editor.

do $$
declare
  v_user_id uuid;
  v_lesson_id uuid;
begin
  select id into v_user_id from auth.users where email = 'YOUR_EMAIL_HERE' limit 1;
  if v_user_id is null then
    raise exception 'No auth user found with that email. Create the user first in Authentication → Users, then edit the email in this file.';
  end if;

  -- ───────────────────────── Lesson 1: My Name + Letter R ─────────────────────────
  insert into lessons (user_id, name, focus, duration_label, order_index, status)
  values (v_user_id, 'My Name + Letter R', 'Recognise her own name and the first letter R.', '15–20 min', 0, 'active')
  returning id into v_lesson_id;

  insert into lesson_songs (lesson_id, role, label, youtube_url, note, order_index) values
    (v_lesson_id, 'hello', 'Hello Song', 'https://www.youtube.com/watch?v=tVlcKp3bWH8', null, 0),
    (v_lesson_id, 'theme', 'I See Something Blue', 'https://www.youtube.com/watch?v=jYAWf8Y91hA', 'For familiar engagement, not the learning focus.', 1),
    (v_lesson_id, 'goodbye', 'Bye Bye Goodbye', 'https://www.youtube.com/watch?v=PraN5ZoSjiY', null, 2);

  insert into lesson_materials (lesson_id, label, order_index) values
    (v_lesson_id, 'Printed RÓŻA name card', 0),
    (v_lesson_id, 'Individual R, Ó, Ż and A cards', 1),
    (v_lesson_id, 'Magnetic letters', 2),
    (v_lesson_id, 'Whiteboard and marker', 3),
    (v_lesson_id, 'Stickers', 4);

  insert into lesson_steps (lesson_id, content, order_index) values
    (v_lesson_id, 'Sing the Hello Song.', 0),
    (v_lesson_id, 'Play the colour song and find colours together.', 1),
    (v_lesson_id, 'Show the full RÓŻA name card.', 2),
    (v_lesson_id, 'Match and arrange the individual letters to copy the name.', 3),
    (v_lesson_id, 'Isolate R and say: "R is for Róża."', 4),
    (v_lesson_id, 'Ask her to find R among a few other letters.', 5),
    (v_lesson_id, 'Decorate or trace a large R.', 6),
    (v_lesson_id, 'Sing the Goodbye Song.', 7);

  insert into sessions (user_id, lesson_id, lesson_name_snapshot, occurred_at, engagement, notes)
  values (
    v_user_id, v_lesson_id, 'My Name + Letter R', '2026-09-03 10:00:00+00', 'loved_it',
    'Hello song, colour song, name activity and goodbye song. Róża stayed engaged and independently arranged the letters to form her name.'
  );

  -- ───────────────────────── Lesson 2: My Family ─────────────────────────
  insert into lessons (user_id, name, focus, duration_label, order_index, status)
  values (v_user_id, 'My Family', 'Match family members with their photos and names.', '15–20 min', 1, 'active')
  returning id into v_lesson_id;

  insert into lesson_songs (lesson_id, role, label, youtube_url, note, order_index) values
    (v_lesson_id, 'hello', 'Hello Song', 'https://www.youtube.com/watch?v=tVlcKp3bWH8', null, 0),
    (v_lesson_id, 'theme', 'The People in My Family', 'https://www.youtube.com/watch?v=yDua9ms9_eg', 'The letter extension is optional — skip it as soon as engagement drops.', 1),
    (v_lesson_id, 'goodbye', 'Bye Bye Goodbye', 'https://www.youtube.com/watch?v=PraN5ZoSjiY', null, 2);

  insert into lesson_materials (lesson_id, label, order_index) values
    (v_lesson_id, 'Four photos: Mummy, Daddy, Róża and Herkules', 0),
    (v_lesson_id, 'Four matching name cards', 1),
    (v_lesson_id, 'Magnets or magnetic letters', 2),
    (v_lesson_id, 'Whiteboard', 3);

  insert into lesson_steps (lesson_id, content, order_index) values
    (v_lesson_id, 'Sing the Hello Song.', 0),
    (v_lesson_id, 'Play the family song.', 1),
    (v_lesson_id, 'Look at each photo and name the person.', 2),
    (v_lesson_id, 'Ask: "Where is Daddy?" "Where is Mummy?" "Where is Herkules?"', 3),
    (v_lesson_id, 'Match each photo to its name card.', 4),
    (v_lesson_id, 'Place the whole family together on the board.', 5),
    (v_lesson_id, 'Optional: find R in RÓŻA and HERKULES.', 6),
    (v_lesson_id, 'Sing the Goodbye Song.', 7);

  -- ───────────────────────── Lesson 3: Numbers 1–3 ─────────────────────────
  insert into lessons (user_id, name, focus, duration_label, order_index, status)
  values (v_user_id, 'Numbers 1–3', 'Understand the quantities one, two and three.', '15–20 min', 2, 'active')
  returning id into v_lesson_id;

  insert into lesson_songs (lesson_id, role, label, youtube_url, note, order_index) values
    (v_lesson_id, 'hello', 'Hello Song', 'https://www.youtube.com/watch?v=tVlcKp3bWH8', null, 0),
    (v_lesson_id, 'theme', 'Count and Move', 'https://www.youtube.com/watch?v=Aq4UAss33qA', 'The song continues beyond three, but hands-on work stays at 1–3. Focus on quantities, not writing numerals.', 1),
    (v_lesson_id, 'goodbye', 'Bye Bye Goodbye', 'https://www.youtube.com/watch?v=PraN5ZoSjiY', null, 2);

  insert into lesson_materials (lesson_id, label, order_index) values
    (v_lesson_id, 'Three small toys or counters', 0),
    (v_lesson_id, 'Magnetic numbers, if available', 1),
    (v_lesson_id, 'Three stickers', 2),
    (v_lesson_id, 'Whiteboard and marker', 3),
    (v_lesson_id, 'Three spaces or small containers', 4);

  insert into lesson_steps (lesson_id, content, order_index) values
    (v_lesson_id, 'Sing the Hello Song.', 0),
    (v_lesson_id, 'Play Count and Move.', 1),
    (v_lesson_id, 'Count one, two and three objects together.', 2),
    (v_lesson_id, 'Ask: "Give me two."', 3),
    (v_lesson_id, 'Repeat with one and three.', 4),
    (v_lesson_id, 'Draw three circles and place one sticker in each.', 5),
    (v_lesson_id, 'Finish with one easy counting challenge using her favourite objects.', 6),
    (v_lesson_id, 'Sing the Goodbye Song.', 7);

  -- ───────────────────────── Lesson 4: Shapes ─────────────────────────
  insert into lessons (user_id, name, focus, duration_label, order_index, status)
  values (v_user_id, 'Shapes', 'Begin with circle and square; add triangle only after repetition.', '15–20 min', 3, 'active')
  returning id into v_lesson_id;

  insert into lesson_songs (lesson_id, role, label, youtube_url, note, order_index) values
    (v_lesson_id, 'hello', 'Hello Song', 'https://www.youtube.com/watch?v=tVlcKp3bWH8', null, 0),
    (v_lesson_id, 'theme', 'Shape Song #1', 'https://www.youtube.com/watch?v=TJhfl5vdxp4', 'After at least one completion, the app may suggest adding triangle. Keep the first repetition to two shapes.', 1),
    (v_lesson_id, 'theme', 'Shape Song #2', 'https://www.youtube.com/watch?v=03pyY9C2Pm8', 'For a later repetition, once triangle is introduced.', 2),
    (v_lesson_id, 'goodbye', 'Bye Bye Goodbye', 'https://www.youtube.com/watch?v=PraN5ZoSjiY', null, 3);

  insert into lesson_materials (lesson_id, label, order_index) values
    (v_lesson_id, 'Whiteboard and marker', 0),
    (v_lesson_id, 'Circle and square cards', 1),
    (v_lesson_id, 'Triangle card for a later repetition', 2),
    (v_lesson_id, 'Stickers or small objects to match', 3);

  insert into lesson_steps (lesson_id, content, order_index) values
    (v_lesson_id, 'Sing the Hello Song.', 0),
    (v_lesson_id, 'Play Shape Song #1.', 1),
    (v_lesson_id, 'Introduce only circle and square.', 2),
    (v_lesson_id, 'Draw each shape on the whiteboard.', 3),
    (v_lesson_id, 'Trace the shapes together.', 4),
    (v_lesson_id, 'Find one circle and one square around the room.', 5),
    (v_lesson_id, 'Match objects or stickers to the shape cards.', 6),
    (v_lesson_id, 'Sing the Goodbye Song.', 7);

  -- ───────────────────────── Lesson 5: Animals + Actions ─────────────────────────
  insert into lessons (user_id, name, focus, duration_label, order_index, status)
  values (v_user_id, 'Animals + Actions', 'Connect familiar animals with playful movements.', '15–20 min', 4, 'active')
  returning id into v_lesson_id;

  insert into lesson_songs (lesson_id, role, label, youtube_url, note, order_index) values
    (v_lesson_id, 'hello', 'Hello Song', 'https://www.youtube.com/watch?v=tVlcKp3bWH8', null, 0),
    (v_lesson_id, 'theme', 'Walking in the Jungle', 'https://www.youtube.com/watch?v=GoSq-yZcJ-4', null, 1),
    (v_lesson_id, 'goodbye', 'Bye Bye Goodbye', 'https://www.youtube.com/watch?v=PraN5ZoSjiY', null, 2);

  insert into lesson_materials (lesson_id, label, order_index) values
    (v_lesson_id, 'Frog, monkey and tiger toys or pictures', 0),
    (v_lesson_id, 'A little open floor space', 1),
    (v_lesson_id, 'Whiteboard, optional', 2);

  insert into lesson_steps (lesson_id, content, order_index) values
    (v_lesson_id, 'Sing the Hello Song.', 0),
    (v_lesson_id, 'Play Walking in the Jungle.', 1),
    (v_lesson_id, 'Introduce frog, monkey and tiger.', 2),
    (v_lesson_id, 'Give each animal a movement: jump, swing or stomp.', 3),
    (v_lesson_id, 'Call an animal and copy its movement together.', 4),
    (v_lesson_id, 'Let Róża choose an animal for Mummy to act out.', 5),
    (v_lesson_id, 'Repeat her favourite animal and action.', 6),
    (v_lesson_id, 'Sing the Goodbye Song.', 7);

end $$;
