import { FiMusic, FiExternalLink } from 'react-icons/fi'
import type { LessonSong } from '../types'

const ROLE_STYLES: Record<string, string> = {
  hello: 'bg-dusty/15 text-dusty-dark',
  theme: 'bg-honey/15 text-honey-dark',
  goodbye: 'bg-coral/15 text-coral'
}

const ROLE_TITLES: Record<string, string> = {
  hello: 'Hello',
  theme: 'Theme',
  goodbye: 'Goodbye'
}

export default function SongButton({ song }: { song: LessonSong }) {
  return (
    <a
      href={song.youtube_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-card border border-navy/5 bg-white px-4 py-3 shadow-softer transition-transform active:scale-[0.98]"
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${ROLE_STYLES[song.role]}`}>
        <FiMusic size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-navy/40">
          {ROLE_TITLES[song.role]}
        </span>
        <span className="block truncate text-sm font-semibold text-navy">{song.label}</span>
        {song.note && <span className="block truncate text-xs text-navy/45">{song.note}</span>}
      </span>
      <FiExternalLink size={16} className="shrink-0 text-navy/30" />
    </a>
  )
}
