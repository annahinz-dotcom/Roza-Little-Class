import { useEffect, useMemo, useState } from 'react'
import { fetchLessons, fetchAllSessions } from '../utils/api'
import type { Lesson, ClassSession } from '../types'

export default function PlanPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchLessons('active'), fetchAllSessions()]).then(([l, s]) => {
      setLessons(l)
      setSessions(s)
      setLoading(false)
    })
  }, [])

  const lastCompleted = sessions[0] ?? null

  const suggested = useMemo(() => {
    if (lessons.length === 0) return null
    let best: { lesson: Lesson; last: number } | null = null
    for (const lesson of lessons) {
      const lessonSessions = sessions.filter((s) => s.lesson_id === lesson.id)
      const last = lessonSessions.length > 0 ? new Date(lessonSessions[0].occurred_at).getTime() : 0
      if (!best || last < best.last) best = { lesson, last }
    }
    return best?.lesson ?? null
  }, [lessons, sessions])

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-first

  const sessionDays = useMemo(() => {
    const set = new Set<number>()
    for (const s of sessions) {
      const d = new Date(s.occurred_at)
      if (d.getFullYear() === year && d.getMonth() === month) set.add(d.getDate())
    }
    return set
  }, [sessions, year, month])

  const monthLabel = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="mx-auto max-w-md px-5 pt-8 pb-6">
      <h1 className="text-2xl font-extrabold text-navy">Plan</h1>
      <p className="mt-1 text-sm text-navy/50">A gentle rhythm, never a rigid schedule.</p>

      <div className="mt-5 rounded-card bg-card p-4 shadow-softer">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Rotation</h2>
        {loading ? (
          <p className="text-sm text-navy/40">Loading…</p>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-navy/70">
            {lessons.map((l, i) => (
              <span key={l.id} className="flex items-center gap-1.5">
                <span
                  className={`rounded-pill px-2.5 py-1 font-semibold ${
                    suggested?.id === l.id ? 'bg-honey text-white' : 'bg-white'
                  }`}
                >
                  {l.name}
                </span>
                {i < lessons.length - 1 && <span className="text-navy/25">→</span>}
              </span>
            ))}
            <span className="text-navy/25">→ repeat</span>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-card bg-card p-4 shadow-softer">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/40">Suggested next</p>
          <p className="mt-1 text-sm font-bold text-navy">{suggested?.name ?? '—'}</p>
        </div>
        <div className="rounded-card bg-card p-4 shadow-softer">
          <p className="text-xs font-bold uppercase tracking-wide text-navy/40">Last completed</p>
          <p className="mt-1 text-sm font-bold text-navy">{lastCompleted?.lesson_name_snapshot ?? '—'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-card bg-card p-4 shadow-softer">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-navy/40">{monthLabel}</h2>
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="font-bold text-navy/35">
              {d}
            </span>
          ))}
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const has = sessionDays.has(day)
            return (
              <span
                key={day}
                className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-navy/70 ${
                  has ? 'bg-sage/25 font-bold text-sage' : ''
                }`}
              >
                {day}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
