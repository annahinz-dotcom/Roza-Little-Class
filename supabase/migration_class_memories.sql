-- Róża's Little Class — Class Memories migration
-- Purely additive: one new table, one new PRIVATE storage bucket, and
-- their RLS policies. Nothing here touches lessons, steps, songs,
-- materials, sessions, or any existing data.
--
-- Run this once in the Supabase SQL Editor, after your earlier migrations.

create table if not exists class_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  step_id uuid references lesson_steps(id) on delete set null,
  storage_path text not null,
  thumbnail_path text not null,
  caption text,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table class_memories enable row level security;

drop policy if exists "class_memories_owner" on class_memories;
create policy "class_memories_owner" on class_memories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_memories_session on class_memories(session_id);
create index if not exists idx_memories_user_date on class_memories(user_id, captured_at desc);

-- Private bucket — "public" is explicitly false, so files are never
-- reachable by a direct link. The app always requests short-lived
-- signed URLs to display anything from here.
insert into storage.buckets (id, name, public)
values ('class-memories', 'class-memories', false)
on conflict (id) do update set public = false;

drop policy if exists "class_memories_storage_select" on storage.objects;
create policy "class_memories_storage_select" on storage.objects
  for select using (bucket_id = 'class-memories' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "class_memories_storage_insert" on storage.objects;
create policy "class_memories_storage_insert" on storage.objects
  for insert with check (bucket_id = 'class-memories' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "class_memories_storage_delete" on storage.objects;
create policy "class_memories_storage_delete" on storage.objects
  for delete using (bucket_id = 'class-memories' and auth.uid()::text = (storage.foldername(name))[1]);
