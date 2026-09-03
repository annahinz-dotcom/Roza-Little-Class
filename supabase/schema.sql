-- Róża's Little Class — database schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- LESSONS
-- ─────────────────────────────────────────────────────────────
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  focus text not null,
  duration_label text not null default '15–20 min',
  order_index int not null default 0,
  status text not null default 'active' check (status in ('active','archived')),
  duplicated_from uuid references lessons(id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lesson_songs (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  role text not null check (role in ('hello','theme','goodbye')),
  label text not null,
  youtube_url text not null,
  note text,
  order_index int not null default 0
);

create table if not exists lesson_materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  label text not null,
  order_index int not null default 0
);

create table if not exists lesson_steps (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  content text not null,
  order_index int not null default 0
);

-- ─────────────────────────────────────────────────────────────
-- SESSIONS (the check-in log — kept even if a lesson is later archived)
-- ─────────────────────────────────────────────────────────────
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  lesson_name_snapshot text not null,
  occurred_at timestamptz not null default now(),
  engagement text check (engagement in ('loved_it','engaged','okay','not_today')),
  difficulty text check (difficulty in ('too_easy','just_right','too_difficult')),
  would_repeat text check (would_repeat in ('yes','with_changes','not_yet')),
  notes text,
  favourite_activity text,
  new_word_or_achievement text,
  materials_used text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security — every row is private to the signed-in user
-- ─────────────────────────────────────────────────────────────
alter table lessons enable row level security;
alter table lesson_songs enable row level security;
alter table lesson_materials enable row level security;
alter table lesson_steps enable row level security;
alter table sessions enable row level security;

create policy "lessons_owner" on lessons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "lesson_songs_owner" on lesson_songs
  for all using (exists (select 1 from lessons l where l.id = lesson_id and l.user_id = auth.uid()))
  with check (exists (select 1 from lessons l where l.id = lesson_id and l.user_id = auth.uid()));

create policy "lesson_materials_owner" on lesson_materials
  for all using (exists (select 1 from lessons l where l.id = lesson_id and l.user_id = auth.uid()))
  with check (exists (select 1 from lessons l where l.id = lesson_id and l.user_id = auth.uid()));

create policy "lesson_steps_owner" on lesson_steps
  for all using (exists (select 1 from lessons l where l.id = lesson_id and l.user_id = auth.uid()))
  with check (exists (select 1 from lessons l where l.id = lesson_id and l.user_id = auth.uid()));

create policy "sessions_owner" on sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists idx_lessons_user_status on lessons(user_id, status, order_index);
create index if not exists idx_songs_lesson on lesson_songs(lesson_id, order_index);
create index if not exists idx_materials_lesson on lesson_materials(lesson_id, order_index);
create index if not exists idx_steps_lesson on lesson_steps(lesson_id, order_index);
create index if not exists idx_sessions_user_date on sessions(user_id, occurred_at desc);
create index if not exists idx_sessions_lesson on sessions(lesson_id);
