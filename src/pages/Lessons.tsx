import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiArchive, FiLogOut, FiMenu } from 'react-icons/fi'
import { fetchLessons, fetchAllSessions } from '../utils/api'
import type { Lesson, ClassSession, Engagement } from '../types'
import LessonCard from '../components/LessonCard'
import Doodle from '../components/Doodle'
import { useAuth } from '../contexts/AuthContext'
import { getAsset } from '../roza-mode/rozaAssets'

export default function Lessons() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [l, s] = await Promise.all([fetchLessons('active'), fetchAllSessions()])
    setLessons(l)
    setSessions(s)
    setLoading(false)
  }

  const byLesson = useMemo(() => {
    const map = new Map<string, ClassSession[]>()
    for (const s of sessions) {
      if (!s.lesson_id) continue
      const arr = map.get(s.lesson_id) ?? []
      arr.push(s)
      map.set(s.lesson_id, arr)
    }
    return map
  }, [sessions])

  const suggestedId = useMemo(() => {
    if (lessons.length === 0) return null
    let best: { id: string; last: number } | null = null
    for (const lesson of lessons) {
      const lessonSessions = byLesson.get(lesson.id) ?? []
      const last = lessonSessions.length > 0 ? new Date(lessonSessions[0].occurred_at).getTime() : 0
      if (!best || last < best.last) best = { id: lesson.id, last }
    }
    return best?.id ?? null
  }, [lessons, byLesson])

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-dusty text-sm font-extrabold text-cream shadow-softer">
            R
          </div>
        </div>
        <div className="relative -mt-1">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-softer text-navy/50"
            aria-label="Menu"
          >
            <FiMenu size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 z-10 w-48 overflow-hidden rounded-2xl bg-white shadow-soft">
              <button
                onClick={() => navigate('/archived')}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-navy/70 hover:bg-cream"
              >
                <FiArchive size={16} /> Archived lessons
              </button>
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-coral hover:bg-cream"
              >
                <FiLogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-5 flex items-end justify-between gap-2">
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight text-navy">Róża's Little Class</h1>
          <p className="mt-1 text-sm text-navy/50">Open a lesson, gather what you need, and go.</p>
        </div>
        <Doodle />
      </div>

      <button
        onClick={() => navigate('/roza-mode')}
        className="mb-5 flex w-full items-center gap-3 rounded-card bg-coral/15 p-3.5 text-left shadow-softer active:scale-[0.99]"
      >
        <img
          src={getAsset('roza').src}
          alt=""
          className="h-14 w-14 rounded-2xl object-cover object-top shadow-softer"
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-extrabold text-navy">Tryb Róży</p>
        </div>
      </button>

      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/35">Lessons</h2>

      {loading ? (
        <p className="mt-10 text-center text-sm text-navy/40">Loading lessons…</p>
      ) : lessons.length === 0 ? (
        <div className="mt-10 rounded-card bg-card p-6 text-center shadow-soft">
          <p className="text-navy/60">No lessons yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const lessonSessions = byLesson.get(lesson.id) ?? []
            const recent: Engagement | null = lessonSessions[0]?.engagement ?? null
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={idx}
                sessionCount={lessonSessions.length}
                recentEngagement={recent}
                suggested={lesson.id === suggestedId}
              />
            )
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/lesson/new')}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-navy/15 py-4 text-sm font-semibold text-navy/45"
      >
        <FiPlus size={16} /> New lesson
      </button>
    </div>
  )
}
