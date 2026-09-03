import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiCheck, FiCopy, FiEdit2, FiArchive } from 'react-icons/fi'
import { fetchLessonFull, fetchSessionsForLesson, duplicateLesson, archiveLesson } from '../utils/api'
import type { LessonFull } from '../types'
import SongButton from '../components/SongButton'

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<LessonFull | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    load(id)
  }, [id])

  async function load(lessonId: string) {
    const [full, sessions] = await Promise.all([fetchLessonFull(lessonId), fetchSessionsForLesson(lessonId)])
    setLesson(full)
    setSessionCount(sessions.length)
    setChecked(new Set()) // materials checklist always starts fresh
  }

  function toggleMaterial(matId: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(matId)) next.delete(matId)
      else next.add(matId)
      return next
    })
  }

  async function handleDuplicate() {
    if (!id) return
    setBusy(true)
    const newId = await duplicateLesson(id)
    setBusy(false)
    navigate(`/lesson/${newId}/edit`)
  }

  async function handleArchive() {
    if (!id) return
    if (!confirm(`Archive "${lesson?.name}"? Its class history stays saved and you can restore it anytime.`)) return
    setBusy(true)
    await archiveLesson(id)
    setBusy(false)
    navigate('/')
  }

  if (!lesson) {
    return <p className="mt-10 text-center text-sm text-navy/40">Loading…</p>
  }

  const checkedLabels = lesson.materials.filter((m) => checked.has(m.id)).map((m) => m.label)

  return (
    <div className="mx-auto max-w-md px-5 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-softer text-navy/50">
          <FiArrowLeft size={18} />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-softer text-navy/50"
            aria-label="Lesson options"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 z-10 w-52 overflow-hidden rounded-2xl bg-white shadow-soft">
              <button
                onClick={() => navigate(`/lesson/${id}/edit`)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-navy/70 hover:bg-cream"
              >
                <FiEdit2 size={16} /> Edit lesson
              </button>
              <button
                onClick={handleDuplicate}
                disabled={busy}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-navy/70 hover:bg-cream"
              >
                <FiCopy size={16} /> Duplicate
              </button>
              <button
                onClick={handleArchive}
                disabled={busy}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-coral hover:bg-cream"
              >
                <FiArchive size={16} /> Archive
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-navy">{lesson.name}</h1>
      <p className="mt-1 text-sm text-navy/55">{lesson.focus}</p>
      <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-navy/40">
        <span className="flex items-center gap-1">
          <FiClock size={13} /> {lesson.duration_label}
        </span>
        <span>{sessionCount} {sessionCount === 1 ? 'class' : 'classes'} so far</span>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Songs</h2>
        <div className="space-y-2">
          {lesson.songs.map((song) => (
            <SongButton key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Materials</h2>
        <div className="space-y-1.5 rounded-card bg-card p-3 shadow-softer">
          {lesson.materials.map((m) => {
            const isChecked = checked.has(m.id)
            return (
              <button
                key={m.id}
                onClick={() => toggleMaterial(m.id)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                    isChecked ? 'border-sage bg-sage text-white' : 'border-navy/20'
                  }`}
                >
                  {isChecked && <FiCheck size={13} strokeWidth={3} />}
                </span>
                <span className={`text-sm ${isChecked ? 'text-navy/45 line-through' : 'text-navy/80'}`}>{m.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Class steps</h2>
        <ol className="space-y-2">
          {lesson.steps.map((step, i) => (
            <li key={step.id} className="flex gap-3 rounded-card bg-card p-3 text-sm text-navy/75 shadow-softer">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dusty/15 text-xs font-bold text-dusty-dark">
                {i + 1}
              </span>
              <span className="pt-0.5">{step.content}</span>
            </li>
          ))}
        </ol>
      </section>

      <button
        onClick={() => navigate(`/lesson/${id}/class`, { state: { materialsUsed: checkedLabels } })}
        className="my-8 w-full rounded-pill bg-honey py-4 text-center text-base font-extrabold text-white shadow-soft active:scale-[0.99]"
      >
        Start Class
      </button>
    </div>
  )
}
