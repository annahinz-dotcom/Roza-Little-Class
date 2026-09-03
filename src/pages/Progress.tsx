import { useEffect, useMemo, useState } from 'react'
import { FiTrash2, FiEdit2 } from 'react-icons/fi'
import { fetchAllSessions, fetchLessons, updateSession, deleteSession } from '../utils/api'
import type { ClassSession, Lesson, Engagement, Difficulty, WouldRepeat } from '../types'
import { ENGAGEMENT_LABELS, DIFFICULTY_LABELS, WOULD_REPEAT_LABELS } from '../types'
import Chip from '../components/Chip'

export default function ProgressPage() {
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const [s, l] = await Promise.all([fetchAllSessions(), fetchLessons('active')])
    setSessions(s)
    setLessons(l)
    setLoading(false)
  }

  const stats = useMemo(() => {
    const perLesson = new Map<string, number>()
    let loved = 0
    for (const s of sessions) {
      if (s.lesson_id) perLesson.set(s.lesson_id, (perLesson.get(s.lesson_id) ?? 0) + 1)
      if (s.engagement === 'loved_it') loved += 1
    }
    const mostLoved = [...perLesson.entries()]
      .map(([lessonId, count]) => ({
        name: lessons.find((l) => l.id === lessonId)?.name ?? 'Archived lesson',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
    return { total: sessions.length, loved, mostLoved }
  }, [sessions, lessons])

  async function handleDelete(id: string) {
    if (!confirm('Delete this session record? This cannot be undone.')) return
    await deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <h1 className="text-2xl font-extrabold text-navy">Progress</h1>
      <p className="mt-1 text-sm text-navy/50">A quiet record — no scores, no pressure.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-card bg-card p-4 shadow-softer">
          <p className="text-2xl font-extrabold text-navy">{stats.total}</p>
          <p className="text-xs font-semibold text-navy/45">Mini-classes so far</p>
        </div>
        <div className="rounded-card bg-card p-4 shadow-softer">
          <p className="text-2xl font-extrabold text-navy">{stats.loved}</p>
          <p className="text-xs font-semibold text-navy/45">Marked "Loved it"</p>
        </div>
      </div>

      {stats.mostLoved.length > 0 && (
        <div className="mt-4 rounded-card bg-card p-4 shadow-softer">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Most-run lessons</h2>
          <ul className="space-y-1 text-sm text-navy/70">
            {stats.mostLoved.map((m) => (
              <li key={m.name} className="flex justify-between">
                <span>{m.name}</span>
                <span className="font-semibold text-navy/45">{m.count}×</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-navy/40">History</h2>
      {loading ? (
        <p className="text-sm text-navy/40">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="rounded-card bg-card p-4 text-sm text-navy/50 shadow-softer">No sessions logged yet.</p>
      ) : (
        <div className="space-y-2 pb-6">
          {sessions.map((s) =>
            editingId === s.id ? (
              <SessionEditor
                key={s.id}
                session={s}
                onCancel={() => setEditingId(null)}
                onSaved={(updated) => {
                  setSessions((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                  setEditingId(null)
                }}
              />
            ) : (
              <div key={s.id} className="rounded-card bg-card p-4 shadow-softer">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-navy">{s.lesson_name_snapshot}</p>
                    <p className="text-xs text-navy/45">
                      {new Date(s.occurred_at).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingId(s.id)} className="rounded-full p-2 text-navy/35 hover:bg-cream" aria-label="Edit">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="rounded-full p-2 text-coral/70 hover:bg-cream" aria-label="Delete">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
                  {s.engagement && <span className="rounded-pill bg-honey/15 px-2 py-1 text-honey-dark">{ENGAGEMENT_LABELS[s.engagement]}</span>}
                  {s.difficulty && <span className="rounded-pill bg-dusty/15 px-2 py-1 text-dusty-dark">{DIFFICULTY_LABELS[s.difficulty]}</span>}
                  {s.would_repeat && <span className="rounded-pill bg-sage/15 px-2 py-1 text-sage">{WOULD_REPEAT_LABELS[s.would_repeat]}</span>}
                </div>
                {s.notes && <p className="mt-2 text-sm text-navy/60">{s.notes}</p>}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function SessionEditor({
  session,
  onCancel,
  onSaved
}: {
  session: ClassSession
  onCancel: () => void
  onSaved: (s: ClassSession) => void
}) {
  const [engagement, setEngagement] = useState<Engagement | null>(session.engagement)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(session.difficulty)
  const [wouldRepeat, setWouldRepeat] = useState<WouldRepeat | null>(session.would_repeat)
  const [notes, setNotes] = useState(session.notes ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const patch = { engagement, difficulty, would_repeat: wouldRepeat, notes: notes || null }
    await updateSession(session.id, patch)
    setSaving(false)
    onSaved({ ...session, ...patch })
  }

  return (
    <div className="rounded-card bg-card p-4 shadow-soft">
      <p className="mb-2 text-sm font-bold text-navy">{session.lesson_name_snapshot}</p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {(Object.keys(ENGAGEMENT_LABELS) as Engagement[]).map((k) => (
          <Chip key={k} label={ENGAGEMENT_LABELS[k]} selected={engagement === k} onClick={() => setEngagement(k)} />
        ))}
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((k) => (
          <Chip key={k} label={DIFFICULTY_LABELS[k]} selected={difficulty === k} onClick={() => setDifficulty(k)} />
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(WOULD_REPEAT_LABELS) as WouldRepeat[]).map((k) => (
          <Chip key={k} label={WOULD_REPEAT_LABELS[k]} selected={wouldRepeat === k} onClick={() => setWouldRepeat(k)} />
        ))}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="mb-3 w-full rounded-2xl border border-navy/10 bg-white px-3 py-2 text-sm outline-none focus:border-dusty"
      />
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 rounded-pill border border-navy/10 py-2 text-sm font-semibold text-navy/60">
          Cancel
        </button>
        <button onClick={save} disabled={saving} className="flex-1 rounded-pill bg-honey py-2 text-sm font-bold text-white disabled:opacity-60">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
