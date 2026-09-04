import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { fetchLessonFull } from '../utils/api'
import type { LessonFull } from '../types'
import SongButton from '../components/SongButton'
import ActivityVisual from '../components/activityVisuals'

export default function StartClass() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const materialsUsed: string[] = (location.state as any)?.materialsUsed ?? []
  const [lesson, setLesson] = useState<LessonFull | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!id) return
    fetchLessonFull(id).then(setLesson)
  }, [id])

  if (!lesson) {
    return <p className="mt-10 text-center text-sm text-navy/40">Loading…</p>
  }

  const step = lesson.steps[stepIndex]
  const isLast = stepIndex === lesson.steps.length - 1

  function endClass() {
    navigate(`/lesson/${id}/checkin`, { state: { materialsUsed } })
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream px-5 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-navy/40">{lesson.name}</p>
          <p className="text-sm text-navy/50">
            Step {stepIndex + 1} of {lesson.steps.length}
          </p>
        </div>
        <button
          onClick={endClass}
          className="flex items-center gap-1 rounded-pill bg-card px-3 py-1.5 text-xs font-bold text-navy/50 shadow-softer"
        >
          <FiX size={14} /> End class
        </button>
      </div>

      <div className="mt-2 flex gap-1.5">
        {lesson.steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-pill ${i <= stepIndex ? 'bg-honey' : 'bg-navy/10'}`}
          />
        ))}
      </div>

      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full rounded-card bg-card p-8 text-center shadow-soft">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-honey/15 text-lg font-extrabold text-honey-dark">
            {stepIndex + 1}
          </span>
          <div className="mb-4 flex justify-center">
            <ActivityVisual
              activityKey={step.activity_visual_key}
              customUrl={step.custom_visual_url}
              size={140}
            />
          </div>
          <p className="text-xl font-bold leading-snug text-navy">{step.content}</p>
        </div>
      </div>

      <div className="space-y-2 pb-4">
        {lesson.songs.map((song) => (
          <SongButton key={song.id} song={song} />
        ))}
      </div>

      <div className="flex gap-3 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-2">
        <button
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="flex flex-1 items-center justify-center gap-1 rounded-pill border border-navy/10 bg-white py-3.5 font-bold text-navy/60 disabled:opacity-40"
        >
          <FiChevronLeft size={18} /> Back
        </button>
        {isLast ? (
          <button
            onClick={endClass}
            className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-sage py-3.5 font-bold text-white shadow-soft"
          >
            Finish class
          </button>
        ) : (
          <button
            onClick={() => setStepIndex((i) => Math.min(lesson.steps.length - 1, i + 1))}
            className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-honey py-3.5 font-bold text-white shadow-soft"
          >
            Next <FiChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
