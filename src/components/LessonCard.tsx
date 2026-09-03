import { useNavigate } from 'react-router-dom'
import { FiClock, FiChevronRight } from 'react-icons/fi'
import type { Lesson, Engagement } from '../types'
import { ENGAGEMENT_LABELS } from '../types'

interface Props {
  lesson: Lesson
  index: number
  sessionCount: number
  recentEngagement: Engagement | null
  suggested?: boolean
}

export default function LessonCard({ lesson, index, sessionCount, recentEngagement, suggested }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/lesson/${lesson.id}`)}
      className="w-full rounded-card border border-navy/5 bg-card p-4 text-left shadow-soft transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-navy/35">
              Lesson {index + 1}
            </span>
            {suggested && (
              <span className="rounded-pill bg-sage/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
                Suggested next
              </span>
            )}
          </div>
          <h3 className="mt-0.5 truncate text-lg font-extrabold text-navy">{lesson.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-navy/55">{lesson.focus}</p>
        </div>
        <FiChevronRight className="mt-1 shrink-0 text-navy/25" size={20} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-navy/45">
        <span className="flex items-center gap-1">
          <FiClock size={13} /> {lesson.duration_label}
        </span>
        <span>
          {sessionCount} {sessionCount === 1 ? 'class' : 'classes'} so far
        </span>
        {recentEngagement && (
          <span className="rounded-pill bg-honey/15 px-2 py-0.5 text-honey-dark">
            Last time: {ENGAGEMENT_LABELS[recentEngagement]}
          </span>
        )}
      </div>
    </button>
  )
}
