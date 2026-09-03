import { useNavigate } from 'react-router-dom'
import { FiClock, FiChevronRight, FiStar } from 'react-icons/fi'
import type { Lesson, Engagement } from '../types'
import { ENGAGEMENT_LABELS } from '../types'

interface Props {
  lesson: Lesson
  index: number
  sessionCount: number
  recentEngagement: Engagement | null
  suggested?: boolean
}

const TILE_PALETTE = [
  { bg: 'bg-dusty', chip: 'bg-honey' },
  { bg: 'bg-coral', chip: 'bg-sage' },
  { bg: 'bg-sage', chip: 'bg-coral' },
  { bg: 'bg-honey-dark', chip: 'bg-dusty' },
  { bg: 'bg-dusty-dark', chip: 'bg-honey' }
]

export default function LessonCard({ lesson, index, sessionCount, recentEngagement, suggested }: Props) {
  const navigate = useNavigate()
  const palette = TILE_PALETTE[index % TILE_PALETTE.length]
  const initial = lesson.name.trim().charAt(0).toUpperCase() || '?'

  return (
    <button
      onClick={() => navigate(`/lesson/${lesson.id}`)}
      className="relative w-full overflow-hidden rounded-card border border-navy/[0.06] bg-card p-3.5 text-left shadow-soft transition-transform active:scale-[0.99]"
    >
      {suggested && (
        <span className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-pill bg-sage/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sage">
          <FiStar size={10} /> Suggested
        </span>
      )}
      <div className="flex gap-3.5">
        <div
          className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${palette.bg} text-2xl font-extrabold text-cream shadow-softer`}
        >
          {initial}
          <span
            className={`absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-lg ${palette.chip} text-[10px] font-bold text-white shadow-softer`}
          >
            {index + 1}
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="truncate pr-16 text-lg font-extrabold leading-tight text-navy">{lesson.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-navy/55">{lesson.focus}</p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-navy/45">
            <span className="flex items-center gap-1">
              <FiClock size={12} /> {lesson.duration_label}
            </span>
            <span>
              {sessionCount} {sessionCount === 1 ? 'class' : 'classes'}
            </span>
            {recentEngagement && (
              <span className="rounded-pill bg-honey/15 px-2 py-0.5 text-honey-dark">
                {ENGAGEMENT_LABELS[recentEngagement]}
              </span>
            )}
          </div>
        </div>

        <FiChevronRight className="mt-1 shrink-0 self-center text-navy/20" size={20} />
      </div>
    </button>
  )
}
