import { useEffect, useMemo, useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { fetchLessons, fetchAllSessions } from '../utils/api'
import type { Lesson, ClassSession } from '../types'
import { ENGAGEMENT_LABELS } from '../types'

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

  const summary = useMemo(() => {
    const engagementCounts: Record<string, number> = {}
    for (const s of sessions) {
      if (s.engagement) engagementCounts[s.engagement] = (engagementCounts[s.engagement] ?? 0) + 1
    }
    const perLesson = lessons
      .map((lesson) => {
        const lessonSessions = sessions.filter((s) => s.lesson_id === lesson.id)
        const loved = lessonSessions.filter((s) => s.engagement === 'loved_it').length
        return { name: lesson.name, count: lessonSessions.length, loved }
      })
      .sort((a, b) => b.count - a.count)

    return { total: sessions.length, engagementCounts, perLesson }
  }, [sessions, lessons])

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

      <h2 className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-navy/40">How it's going</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-card bg-card p-4 shadow-softer">
          <p className="text-2xl font-extrabold text-navy">{summary.total}</p>
          <p className="text-xs font-semibold text-navy/45">Mini-classes so far</p>
        </div>
        <div className="rounded-card bg-card p-4 shadow-softer">
          <p className="flex items-center gap-1 text-2xl font-extrabold text-honey-dark">
            <FiStar size={18} /> {summary.engagementCounts['loved_it'] ?? 0}
          </p>
          <p className="text-xs font-semibold text-navy/45">Marked "Loved it"</p>
        </div>
      </div>

      {summary.total > 0 && (
        <div className="mt-3 rounded-card bg-card p-4 shadow-softer">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Response breakdown</h3>
          <div className="space-y-1.5">
            {(Object.keys(ENGAGEMENT_LABELS) as (keyof typeof ENGAGEMENT_LABELS)[]).map((key) => {
              const count = summary.engagementCounts[key] ?? 0
              const pct = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-2 text-xs">
                  <span className="w-20 shrink-0 font-semibold text-navy/60">{ENGAGEMENT_LABELS[key]}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-pill bg-navy/5">
                    <div className="h-full rounded-pill bg-sage" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-5 shrink-0 text-right font-semibold text-navy/40">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {summary.perLesson.length > 0 && (
        <div className="mt-3 rounded-card bg-card p-4 shadow-softer">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Classes completed per lesson</h3>
          <ul className="space-y-1.5 text-sm">
            {summary.perLesson.map((l) => (
              <li key={l.name} className="flex items-center justify-between text-navy/70">
                <span>{l.name}</span>
                <span className="flex items-center gap-2 text-xs font-semibold text-navy/45">
                  {l.loved > 0 && (
                    <span className="flex items-center gap-0.5 text-honey-dark">
                      <FiStar size={11} /> {l.loved}
                    </span>
                  )}
                  {l.count}×
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
