import { supabase } from '../lib/supabaseClient'
import type {
  Lesson,
  LessonFull,
  LessonMaterial,
  LessonSong,
  LessonStep,
  ClassSession
} from '../types'

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error('Not signed in')
  return data.user.id
}

export async function fetchLessons(status: 'active' | 'archived'): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('status', status)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data as Lesson[]
}

export async function fetchLessonFull(id: string): Promise<LessonFull> {
  const [{ data: lesson, error: lessonErr }, { data: songs, error: songsErr }, { data: materials, error: matErr }, { data: steps, error: stepErr }] =
    await Promise.all([
      supabase.from('lessons').select('*').eq('id', id).single(),
      supabase.from('lesson_songs').select('*').eq('lesson_id', id).order('order_index', { ascending: true }),
      supabase.from('lesson_materials').select('*').eq('lesson_id', id).order('order_index', { ascending: true }),
      supabase.from('lesson_steps').select('*').eq('lesson_id', id).order('order_index', { ascending: true })
    ])
  if (lessonErr) throw lessonErr
  if (songsErr) throw songsErr
  if (matErr) throw matErr
  if (stepErr) throw stepErr
  return {
    ...(lesson as Lesson),
    songs: (songs as LessonSong[]) ?? [],
    materials: (materials as LessonMaterial[]) ?? [],
    steps: (steps as LessonStep[]) ?? []
  }
}

export async function fetchAllSessions(): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('occurred_at', { ascending: false })
  if (error) throw error
  return data as ClassSession[]
}

export async function fetchSessionsForLesson(lessonId: string): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('occurred_at', { ascending: false })
  if (error) throw error
  return data as ClassSession[]
}

export async function createDraftSession(lessonId: string, lessonName: string): Promise<ClassSession> {
  const user_id = await requireUserId()
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id,
      lesson_id: lessonId,
      lesson_name_snapshot: lessonName,
      engagement: null,
      difficulty: null,
      would_repeat: null,
      notes: null,
      favourite_activity: null,
      new_word_or_achievement: null,
      materials_used: null
    })
    .select()
    .single()
  if (error) throw error
  return data as ClassSession
}

export async function createSession(input: {
  lesson_id: string
  lesson_name_snapshot: string
  engagement: string | null
  difficulty: string | null
  would_repeat: string | null
  notes: string | null
  favourite_activity: string | null
  new_word_or_achievement: string | null
  materials_used: string[] | null
}): Promise<ClassSession> {
  const user_id = await requireUserId()
  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...input, user_id })
    .select()
    .single()
  if (error) throw error
  return data as ClassSession
}

export async function updateSession(id: string, patch: Partial<ClassSession>): Promise<void> {
  const { error } = await supabase.from('sessions').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) throw error
}

interface LessonFormInput {
  name: string
  focus: string
  duration_label: string
  songs: { role: 'hello' | 'theme' | 'goodbye'; label: string; youtube_url: string; note: string | null }[]
  materials: string[]
  steps: { content: string; activityVisualKey: string | null; customVisualUrl: string | null }[]
}

export async function createLesson(input: LessonFormInput): Promise<string> {
  const user_id = await requireUserId()
  const { data: existing } = await supabase.from('lessons').select('order_index').order('order_index', { ascending: false }).limit(1)
  const nextOrder = existing && existing.length > 0 ? existing[0].order_index + 1 : 0

  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      user_id,
      name: input.name,
      focus: input.focus,
      duration_label: input.duration_label,
      order_index: nextOrder,
      status: 'active'
    })
    .select()
    .single()
  if (error) throw error

  await writeLessonChildren(lesson.id, input)
  return lesson.id
}

export async function updateLesson(id: string, input: LessonFormInput): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .update({
      name: input.name,
      focus: input.focus,
      duration_label: input.duration_label,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  if (error) throw error

  // simplest reliable approach for a small personal dataset: replace child rows
  await supabase.from('lesson_songs').delete().eq('lesson_id', id)
  await supabase.from('lesson_materials').delete().eq('lesson_id', id)
  await supabase.from('lesson_steps').delete().eq('lesson_id', id)
  await writeLessonChildren(id, input)
}

async function writeLessonChildren(lessonId: string, input: LessonFormInput) {
  if (input.songs.length > 0) {
    const { error } = await supabase.from('lesson_songs').insert(
      input.songs.map((s, idx) => ({
        lesson_id: lessonId,
        role: s.role,
        label: s.label,
        youtube_url: s.youtube_url,
        note: s.note,
        order_index: idx
      }))
    )
    if (error) throw error
  }
  if (input.materials.length > 0) {
    const { error } = await supabase.from('lesson_materials').insert(
      input.materials.map((label, idx) => ({ lesson_id: lessonId, label, order_index: idx }))
    )
    if (error) throw error
  }
  if (input.steps.length > 0) {
    const { error } = await supabase.from('lesson_steps').insert(
      input.steps.map((s, idx) => ({
        lesson_id: lessonId,
        content: s.content,
        order_index: idx,
        activity_visual_key: s.activityVisualKey,
        custom_visual_url: s.customVisualUrl
      }))
    )
    if (error) throw error
  }
}

export async function duplicateLesson(id: string): Promise<string> {
  const full = await fetchLessonFull(id)
  return createLesson({
    name: `${full.name} (copy)`,
    focus: full.focus,
    duration_label: full.duration_label,
    songs: full.songs.map((s) => ({ role: s.role, label: s.label, youtube_url: s.youtube_url, note: s.note })),
    materials: full.materials.map((m) => m.label),
    steps: full.steps.map((s) => ({
      content: s.content,
      activityVisualKey: s.activity_visual_key,
      customVisualUrl: s.custom_visual_url
    }))
  }).then(async (newId) => {
    await supabase.from('lessons').update({ duplicated_from: id }).eq('id', newId)
    return newId
  })
}

export async function archiveLesson(id: string): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function uploadCustomVisual(file: File): Promise<string> {
  const user_id = await requireUserId()
  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${user_id}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('lesson-visuals').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('lesson-visuals').getPublicUrl(path)
  return data.publicUrl
}

export async function restoreLesson(id: string): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .update({ status: 'active', archived_at: null })
    .eq('id', id)
  if (error) throw error
}
