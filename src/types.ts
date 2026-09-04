export type LessonStatus = 'active' | 'archived'
export type SongRole = 'hello' | 'theme' | 'goodbye'
export type Engagement = 'loved_it' | 'engaged' | 'okay' | 'not_today'
export type Difficulty = 'too_easy' | 'just_right' | 'too_difficult'
export type WouldRepeat = 'yes' | 'with_changes' | 'not_yet'

export interface Lesson {
  id: string
  user_id: string
  name: string
  focus: string
  duration_label: string
  order_index: number
  status: LessonStatus
  duplicated_from: string | null
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface LessonSong {
  id: string
  lesson_id: string
  role: SongRole
  label: string
  youtube_url: string
  note: string | null
  order_index: number
}

export interface LessonMaterial {
  id: string
  lesson_id: string
  label: string
  order_index: number
}

export interface LessonStep {
  id: string
  lesson_id: string
  content: string
  order_index: number
  activity_visual_key: string | null
  custom_visual_url: string | null
}

export interface LessonFull extends Lesson {
  songs: LessonSong[]
  materials: LessonMaterial[]
  steps: LessonStep[]
}

export interface ClassSession {
  id: string
  user_id: string
  lesson_id: string | null
  lesson_name_snapshot: string
  occurred_at: string
  engagement: Engagement | null
  difficulty: Difficulty | null
  would_repeat: WouldRepeat | null
  notes: string | null
  favourite_activity: string | null
  new_word_or_achievement: string | null
  materials_used: string[] | null
  created_at: string
  updated_at: string
}

export interface ClassMemory {
  id: string
  user_id: string
  session_id: string
  lesson_id: string | null
  step_id: string | null
  storage_path: string
  thumbnail_path: string
  caption: string | null
  captured_at: string
  created_at: string
  updated_at: string
}

export const ENGAGEMENT_LABELS: Record<Engagement, string> = {
  loved_it: 'Loved it',
  engaged: 'Engaged',
  okay: 'Okay',
  not_today: 'Not today'
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  too_easy: 'Too easy',
  just_right: 'Just right',
  too_difficult: 'Too difficult'
}

export const WOULD_REPEAT_LABELS: Record<WouldRepeat, string> = {
  yes: 'Yes',
  with_changes: 'With changes',
  not_yet: 'Not yet'
}
