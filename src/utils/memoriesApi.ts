import { supabase } from '../lib/supabaseClient'
import type { ClassMemory } from '../types'
import { processPhoto } from './photo'

const BUCKET = 'class-memories'
const SIGNED_URL_TTL = 60 * 60 // 1 hour

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error('Not signed in')
  return data.user.id
}

/**
 * Uploads one photo (already picked from camera or camera roll) and creates
 * its class_memories row. Compression/orientation/thumbnailing all happen
 * on-device first — see utils/photo.ts.
 */
export async function addMemory(params: {
  file: File
  sessionId: string
  lessonId: string | null
  stepId: string | null
  caption: string | null
}): Promise<ClassMemory> {
  const userId = await requireUserId()
  const { displayBlob, thumbnailBlob } = await processPhoto(params.file)

  const base = `${userId}/${params.sessionId}/${crypto.randomUUID()}`
  const storagePath = `${base}.jpg`
  const thumbnailPath = `${base}-thumb.jpg`

  const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(storagePath, displayBlob, {
    contentType: 'image/jpeg',
    upsert: false
  })
  if (uploadErr) throw uploadErr

  const { error: thumbErr } = await supabase.storage.from(BUCKET).upload(thumbnailPath, thumbnailBlob, {
    contentType: 'image/jpeg',
    upsert: false
  })
  if (thumbErr) {
    // Don't leave an orphaned full-size file if the thumbnail step fails.
    await supabase.storage.from(BUCKET).remove([storagePath])
    throw thumbErr
  }

  const { data, error } = await supabase
    .from('class_memories')
    .insert({
      user_id: userId,
      session_id: params.sessionId,
      lesson_id: params.lessonId,
      step_id: params.stepId,
      storage_path: storagePath,
      thumbnail_path: thumbnailPath,
      caption: params.caption
    })
    .select()
    .single()

  if (error) {
    // Roll back the uploaded files if the DB row couldn't be created,
    // so a failed save never leaves unreachable orphaned files.
    await supabase.storage.from(BUCKET).remove([storagePath, thumbnailPath])
    throw error
  }

  return data as ClassMemory
}

export async function fetchMemoriesForSession(sessionId: string): Promise<ClassMemory[]> {
  const { data, error } = await supabase
    .from('class_memories')
    .select('*')
    .eq('session_id', sessionId)
    .order('captured_at', { ascending: true })
  if (error) throw error
  return data as ClassMemory[]
}

export async function fetchAllMemories(): Promise<ClassMemory[]> {
  const { data, error } = await supabase
    .from('class_memories')
    .select('*')
    .order('captured_at', { ascending: false })
  if (error) throw error
  return data as ClassMemory[]
}

export async function updateMemoryCaption(id: string, caption: string | null): Promise<void> {
  const { error } = await supabase
    .from('class_memories')
    .update({ caption, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteMemory(memory: ClassMemory): Promise<void> {
  const { error: storageErr } = await supabase.storage
    .from(BUCKET)
    .remove([memory.storage_path, memory.thumbnail_path])
  // Continue even if a storage file was already missing — the DB row is
  // the source of truth for what the user sees, and we still want it gone.
  if (storageErr) console.warn('Could not remove stored file(s):', storageErr.message)

  const { error } = await supabase.from('class_memories').delete().eq('id', memory.id)
  if (error) throw error
}

const signedUrlCache = new Map<string, { url: string; expiresAt: number }>()

export async function getSignedUrl(path: string): Promise<string> {
  const cached = signedUrlCache.get(path)
  if (cached && cached.expiresAt > Date.now() + 30_000) return cached.url

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL)
  if (error) throw error
  signedUrlCache.set(path, { url: data.signedUrl, expiresAt: Date.now() + SIGNED_URL_TTL * 1000 })
  return data.signedUrl
}
