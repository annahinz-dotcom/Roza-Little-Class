import type { ReactNode } from 'react'

// Small, original vector icons for the Róża Mode home-screen tiles.
// Same visual language as the lesson-step activity illustrations (soft
// rounded backdrop + simple line/shape art in the app palette) — chosen
// deliberately over photo crops, which don't read cleanly at icon size.

const STROKE = '#243746'
const NOTE = '#6F91A8'
const SUN = '#E6A93D'
const LEAF = '#91A982'
const BLUSH = '#D97D68'

function Backdrop({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div className={`flex items-center justify-center rounded-3xl ${bg}`} style={{ width: '100%', height: '100%' }}>
      <svg width="62%" height="62%" viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </div>
  )
}

export function SlowoIcon() {
  return (
    <Backdrop bg="bg-dusty/20">
      {['R', 'Ó', 'Ż', 'A'].map((ch, i) => (
        <g key={ch} transform={`translate(${8 + i * 14},18)`}>
          <rect width="12" height="16" rx="3" fill="#FFF9EF" stroke={STROKE} strokeWidth="1.6" />
          <text x="6" y="12" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="9" fill={NOTE}>
            {ch}
          </text>
        </g>
      ))}
      <path d="M8 44h56" stroke={STROKE} strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
    </Backdrop>
  )
}

export function KsztaltyIcon() {
  return (
    <Backdrop bg="bg-honey/20">
      <circle cx="16" cy="36" r="10" fill="#FFF9EF" stroke={NOTE} strokeWidth="2.4" />
      <rect x="30" y="26" width="20" height="20" rx="3" fill="#FFF9EF" stroke={SUN} strokeWidth="2.4" />
      <path d="M62 46l-9-18-9 18z" fill="#FFF9EF" stroke={BLUSH} strokeWidth="2.4" strokeLinejoin="round" />
    </Backdrop>
  )
}

export function UczuciaIcon() {
  return (
    <Backdrop bg="bg-coral/20">
      <circle cx="36" cy="32" r="24" fill="#FFF9EF" stroke={STROKE} strokeWidth="2.2" />
      <circle cx="27" cy="27" r="2.6" fill={STROKE} />
      <circle cx="45" cy="27" r="2.6" fill={STROKE} />
      <circle cx="27" cy="36" r="4" fill={BLUSH} opacity="0.5" />
      <circle cx="45" cy="36" r="4" fill={BLUSH} opacity="0.5" />
      <path d="M25 38c4 6 18 6 22 0" stroke={STROKE} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </Backdrop>
  )
}

export function EnglishIcon() {
  return (
    <Backdrop bg="bg-sage/20">
      <path
        d="M10 16h44c4 0 6 2 6 6v18c0 4-2 6-6 6H30l-8 8v-8H10c-4 0-6-2-6-6V22c0-4 2-6 6-6z"
        fill="#FFF9EF"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
        transform="translate(6,2)"
      />
      <text x="38" y="36" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="15" fill={LEAF}>
        EN
      </text>
    </Backdrop>
  )
}
