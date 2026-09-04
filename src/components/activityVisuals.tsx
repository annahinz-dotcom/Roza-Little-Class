import type { ReactNode } from 'react'

export type ActivityVisualKey =
  | 'hello-song'
  | 'song'
  | 'goodbye-song'
  | 'show-name-card'
  | 'show-letter'
  | 'arrange-letters'
  | 'arrange'
  | 'match'
  | 'sort'
  | 'find'
  | 'point'
  | 'count'
  | 'shapes'
  | 'cut'
  | 'glue'
  | 'colour'
  | 'draw'
  | 'trace'
  | 'stickers'
  | 'story'
  | 'movement'
  | 'animal-action'
  | 'look'
  | 'finished'

interface VisualDef {
  label: string
  backdrop: string // tailwind bg class, soft/15 tone
  render: () => ReactNode
}

// Shared stroke styling keeps every icon feeling like one family.
const STROKE = '#243746'
const NOTE = '#6F91A8'
const SUN = '#E6A93D'
const LEAF = '#91A982'
const BLUSH = '#D97D68'

function Waving() {
  return (
    <>
      <circle cx="34" cy="26" r="10" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
      <path d="M34 36c-9 0-15 6-15 14h30c0-8-6-14-15-14z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
      <path d="M47 20c3-2 6-1 7 2s-1 6-4 6" fill="none" stroke={BLUSH} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 44l4-4M14 50h5M16 56l4 4" stroke={NOTE} strokeWidth="1.6" strokeLinecap="round" />
    </>
  )
}

function MusicNotes() {
  return (
    <>
      <circle cx="24" cy="46" r="7" fill={NOTE} />
      <circle cx="46" cy="40" r="7" fill={SUN} />
      <path d="M31 46V20l22-4v20" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  )
}

const ACTIVITY_VISUALS: Record<ActivityVisualKey, VisualDef> = {
  'hello-song': {
    label: 'Hello Song',
    backdrop: 'bg-dusty/15',
    render: Waving
  },
  song: {
    label: 'Song',
    backdrop: 'bg-dusty/15',
    render: MusicNotes
  },
  'goodbye-song': {
    label: 'Goodbye Song',
    backdrop: 'bg-coral/15',
    render: () => (
      <>
        <circle cx="34" cy="26" r="10" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <path d="M34 36c-9 0-15 6-15 14h30c0-8-6-14-15-14z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <path d="M20 22c-3-2-6-1-7 2s1 6 4 6" fill="none" stroke={BLUSH} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="48" cy="48" r="5" fill={SUN} />
        <path d="M55 44v-6l6 3z" fill={SUN} />
      </>
    )
  },
  'show-name-card': {
    label: 'Name card',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <rect x="10" y="20" width="52" height="32" rx="8" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <text x="36" y="42" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="15" fill={NOTE}>
          RÓŻA
        </text>
      </>
    )
  },
  'show-letter': {
    label: 'Show a letter',
    backdrop: 'bg-dusty/15',
    render: () => (
      <>
        <rect x="16" y="12" width="40" height="48" rx="9" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <text x="36" y="46" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="28" fill={NOTE}>
          R
        </text>
      </>
    )
  },
  'arrange-letters': {
    label: 'Arrange letters',
    backdrop: 'bg-sage/15',
    render: () => (
      <>
        {['R', 'Ó', 'Ż', 'A'].map((ch, i) => (
          <g key={ch} transform={`translate(${8 + i * 14},18)`}>
            <rect width="12" height="16" rx="3" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.6" />
            <text x="6" y="12" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="9" fill={LEAF}>
              {ch}
            </text>
          </g>
        ))}
        <path d="M8 44h56" stroke={STROKE} strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
      </>
    )
  },
  arrange: {
    label: 'Arrange / put together',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <rect x="8" y="30" width="16" height="16" rx="4" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" />
        <circle cx="36" cy="20" r="8" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" />
        <path d="M50 30l10 16H40z" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M28 38h6M40 24l4 6" stroke={SUN} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 4" />
      </>
    )
  },
  match: {
    label: 'Match',
    backdrop: 'bg-sage/15',
    render: () => (
      <>
        <rect x="8" y="18" width="22" height="28" rx="6" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <rect x="42" y="18" width="22" height="28" rx="6" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <circle cx="19" cy="32" r="6" fill={LEAF} />
        <circle cx="53" cy="32" r="6" fill={LEAF} />
        <path d="M31 32h10" stroke={STROKE} strokeWidth="1.6" strokeDasharray="1 4" strokeLinecap="round" />
      </>
    )
  },
  sort: {
    label: 'Sort',
    backdrop: 'bg-dusty/15',
    render: () => (
      <>
        <rect x="8" y="38" width="22" height="16" rx="4" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" />
        <rect x="42" y="38" width="22" height="16" rx="4" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" />
        <circle cx="15" cy="46" r="4" fill={NOTE} />
        <circle cx="24" cy="46" r="4" fill={NOTE} />
        <circle cx="49" cy="46" r="4" fill={SUN} />
        <circle cx="58" cy="46" r="4" fill={SUN} />
        <circle cx="20" cy="18" r="4" fill={NOTE} />
        <circle cx="52" cy="18" r="4" fill={SUN} />
      </>
    )
  },
  find: {
    label: 'Find',
    backdrop: 'bg-coral/15',
    render: () => (
      <>
        <circle cx="28" cy="28" r="16" fill="#FFF9EF" stroke={STROKE} strokeWidth="2.2" />
        <path d="M40 40l14 14" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
        <text x="28" y="34" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="14" fill={BLUSH}>
          R
        </text>
      </>
    )
  },
  point: {
    label: 'Point',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <path
          d="M20 44V26c0-2 2-4 4-4s4 2 4 4v10M28 36v-4c0-2 2-4 4-4s4 2 4 4v6M36 38v-2c0-2 2-4 4-4s4 2 4 4v6"
          fill="none"
          stroke={STROKE}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M44 40c4 0 8 2 8 8v6c0 4-4 8-10 8H30c-6 0-9-4-11-8l-6-10c-1-2 0-4 2-5 2-1 4 0 5 2l4 6" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      </>
    )
  },
  count: {
    label: 'Count',
    backdrop: 'bg-sage/15',
    render: () => (
      <>
        <circle cx="16" cy="36" r="7" fill={LEAF} />
        <circle cx="36" cy="36" r="7" fill={SUN} />
        <circle cx="56" cy="36" r="7" fill={NOTE} />
        <text x="16" y="20" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="11" fill={STROKE}>1</text>
        <text x="36" y="20" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="11" fill={STROKE}>2</text>
        <text x="56" y="20" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="11" fill={STROKE}>3</text>
      </>
    )
  },
  shapes: {
    label: 'Shapes',
    backdrop: 'bg-dusty/15',
    render: () => (
      <>
        <circle cx="16" cy="36" r="10" fill="#FFF9EF" stroke={NOTE} strokeWidth="2.4" />
        <rect x="30" y="26" width="20" height="20" rx="3" fill="#FFF9EF" stroke={SUN} strokeWidth="2.4" />
        <path d="M62 46l-9-18-9 18z" fill="#FFF9EF" stroke={BLUSH} strokeWidth="2.4" strokeLinejoin="round" />
      </>
    )
  },
  cut: {
    label: 'Cut',
    backdrop: 'bg-coral/15',
    render: () => (
      <>
        <path d="M10 34h34" stroke={STROKE} strokeWidth="1.6" strokeDasharray="2 5" strokeLinecap="round" />
        <circle cx="52" cy="20" r="6" fill="none" stroke={STROKE} strokeWidth="2.2" />
        <circle cx="52" cy="48" r="6" fill="none" stroke={STROKE} strokeWidth="2.2" />
        <path d="M52 26L26 34M52 42L26 34" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" />
      </>
    )
  },
  glue: {
    label: 'Glue',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <rect x="22" y="16" width="20" height="14" rx="3" fill={SUN} stroke={STROKE} strokeWidth="1.8" />
        <path d="M25 30h14v22a7 7 0 01-14 0V30z" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" />
        <path d="M46 44c4-2 8-2 10 1" stroke={NOTE} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 4" />
      </>
    )
  },
  colour: {
    label: 'Colouring',
    backdrop: 'bg-sage/15',
    render: () => (
      <>
        <path d="M18 50l4-14 22-22 10 10-22 22-14 4z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M44 14l10 10" stroke={BLUSH} strokeWidth="4" strokeLinecap="round" />
        <path d="M22 36l6 6" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
      </>
    )
  },
  draw: {
    label: 'Draw',
    backdrop: 'bg-dusty/15',
    render: () => (
      <>
        <path d="M16 48l4-14 24-24 10 10-24 24-14 4z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M42 12l10 10" stroke={NOTE} strokeWidth="4" strokeLinecap="round" />
        <path d="M14 56c8-3 12 2 20-1" stroke={SUN} strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    )
  },
  trace: {
    label: 'Trace',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <text x="30" y="46" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="34" fill="none" stroke={STROKE} strokeWidth="1.4" strokeDasharray="1 5">
          R
        </text>
        <circle cx="50" cy="40" r="4" fill={SUN} />
        <path d="M46 44l6-16" stroke={SUN} strokeWidth="1.6" strokeLinecap="round" />
      </>
    )
  },
  stickers: {
    label: 'Stickers',
    backdrop: 'bg-coral/15',
    render: () => (
      <>
        <rect x="10" y="12" width="44" height="40" rx="8" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.8" strokeDasharray="1 4" />
        {[
          [22, 26],
          [42, 26],
          [32, 40]
        ].map(([x, y], i) => (
          <path
            key={i}
            d="M0 -6l1.8 3.7L6 -1.3l-2.6 3.6L4.7 6 0 4l-4.7 2 1.3-3.7L-6 -1.3l4.2 0.4z"
            fill={SUN}
            transform={`translate(${x} ${y})`}
          />
        ))}
      </>
    )
  },
  story: {
    label: 'Story / book',
    backdrop: 'bg-dusty/15',
    render: () => (
      <>
        <path d="M12 18c8-4 16-4 22 0v34c-6-4-14-4-22 0V18z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M58 18c-8-4-16-4-22 0v34c6-4 14-4 22 0V18z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M20 26h8M20 34h8M44 26h8M44 34h8" stroke={NOTE} strokeWidth="1.6" strokeLinecap="round" />
      </>
    )
  },
  movement: {
    label: 'Movement',
    backdrop: 'bg-sage/15',
    render: () => (
      <>
        <circle cx="36" cy="16" r="6" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <path d="M36 22v14M36 26l-12 6M36 26l12 6M36 36l-8 16M36 36l8 16" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>
    )
  },
  'animal-action': {
    label: 'Animal action',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <ellipse cx="34" cy="40" rx="18" ry="13" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <circle cx="22" cy="26" r="7" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" />
        <circle cx="19" cy="21" r="2.2" fill={STROKE} />
        <path d="M14 46c-4 2-7 6-6 10M54 46c4 2 7 6 6 10" stroke={STROKE} strokeWidth="2" strokeLinecap="round" fill="none" />
      </>
    )
  },
  look: {
    label: 'Look / show',
    backdrop: 'bg-dusty/15',
    render: () => (
      <>
        <path d="M8 34c8-12 40-12 48 0-8 12-40 12-48 0z" fill="#FFF9EF" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="32" cy="34" r="8" fill={NOTE} />
        <circle cx="32" cy="34" r="3" fill="#FFF9EF" />
      </>
    )
  },
  finished: {
    label: 'Finished / celebration',
    backdrop: 'bg-honey/15',
    render: () => (
      <>
        <path
          d="M32 8l5.8 12.8L52 23l-10 9.6L44.6 46 32 39l-12.6 7 2.6-13.4L12 23l14.2-2.2z"
          fill={SUN}
          stroke={STROKE}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </>
    )
  }
}

export function getActivityVisualLabel(key: string | null | undefined): string {
  if (!key) return 'No visual'
  return ACTIVITY_VISUALS[key as ActivityVisualKey]?.label ?? 'No visual'
}

export const ACTIVITY_VISUAL_OPTIONS: { key: ActivityVisualKey; label: string }[] = (
  Object.keys(ACTIVITY_VISUALS) as ActivityVisualKey[]
).map((key) => ({ key, label: ACTIVITY_VISUALS[key].label }))

/**
 * Suggests an activity visual key from the plain-text content of a step.
 * This is only a *starting point* in the editor — the parent can always
 * review and override it, and the saved key is what's actually used.
 */
export function suggestActivityVisualKey(stepText: string): ActivityVisualKey | null {
  const t = stepText.toLowerCase()
  const has = (...words: string[]) => words.some((w) => t.includes(w))

  if (has('hello song')) return 'hello-song'
  if (has('goodbye song', 'bye bye', 'bye-bye')) return 'goodbye-song'
  if (has('song', 'sing', 'play the', 'music')) return 'song'
  if (has('róża name card', 'roza name card', 'name card')) return 'show-name-card'
  if (has('arrange the individual letters', 'arrange letters', 'copy the name')) return 'arrange-letters'
  if (has('isolate', 'show the letter', 'letter r', 'find r in')) return 'show-letter'
  if (has('match')) return 'match'
  if (has('sort', 'group')) return 'sort'
  if (has('find', 'look for')) return 'find'
  if (has('where is', 'point')) return 'point'
  if (has('count', 'give me', 'one, two', 'quantity')) return 'count'
  if (has('circle', 'square', 'triangle', 'shape')) return 'shapes'
  if (has('cut')) return 'cut'
  if (has('glue', 'stick')) return 'glue'
  if (has('colour', 'color', 'decorate')) return 'colour'
  if (has('draw')) return 'draw'
  if (has('trace')) return 'trace'
  if (has('sticker')) return 'stickers'
  if (has('book', 'story', 'read')) return 'story'
  if (has('jump', 'stomp', 'swing', 'move like', 'movement', 'act out')) return 'animal-action'
  if (has('animal', 'frog', 'monkey', 'tiger')) return 'animal-action'
  if (has('introduce', 'look at', 'show')) return 'look'
  if (has('place together', 'place the whole', 'assemble')) return 'arrange'
  return null
}

export default function ActivityVisual({
  activityKey,
  customUrl,
  size = 96
}: {
  activityKey?: string | null
  customUrl?: string | null
  size?: number
}) {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt={getActivityVisualLabel(activityKey)}
        width={size}
        height={size}
        className="rounded-2xl object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  const def = activityKey ? ACTIVITY_VISUALS[activityKey as ActivityVisualKey] : undefined

  if (!def) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl bg-navy/5"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={STROKE} strokeWidth="1.5" opacity="0.3" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl ${def.backdrop}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={def.label}
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {def.render()}
      </svg>
    </div>
  )
}
