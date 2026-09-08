import type { ReactNode } from 'react'

// Simple, original facial-expression icons — same visual language as the
// shape icons (soft rounded backdrop + thin navy line-art) rather than
// emojis or stock icons, per the brief.

const STROKE = '#243746'
const CREAM = '#FFF9EF'
const BLUSH = '#D97D68'
const NOTE = '#6F91A8'
const SUN = '#E6A93D'

function Face({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white/55">
      <svg width="70%" height="70%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="42" fill={CREAM} stroke={STROKE} strokeWidth="3.5" />
        {children}
      </svg>
    </div>
  )
}

export function FaceRadosna() {
  return (
    <Face>
      <path d="M30 42c2-5 8-5 10 0" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M60 42c2-5 8-5 10 0" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="33" cy="58" r="5" fill={BLUSH} opacity="0.4" />
      <circle cx="67" cy="58" r="5" fill={BLUSH} opacity="0.4" />
      <path d="M28 60c6 14 38 14 44 0" stroke={STROKE} strokeWidth="4" strokeLinecap="round" fill="none" />
    </Face>
  )
}

export function FaceSmutna() {
  return (
    <Face>
      <circle cx="35" cy="45" r="3" fill={STROKE} />
      <circle cx="65" cy="45" r="3" fill={STROKE} />
      <path d="M28 42c3-4 8-4 10 0" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M62 42c3-4 8-4 10 0" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M31 74c8-10 30-10 38 0" stroke={STROKE} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M35 50c-1 6-3 9-6 12" stroke={NOTE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="28" cy="64" rx="3" ry="4" fill={NOTE} />
    </Face>
  )
}

export function FaceZmeczona() {
  return (
    <Face>
      <path d="M27 46h16" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M57 46h16" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="50" cy="66" rx="10" ry="13" fill={STROKE} opacity="0.85" />
      <path d="M70 28l6-4M75 32l6-2M73 22l4-5" stroke={SUN} strokeWidth="2.5" strokeLinecap="round" />
    </Face>
  )
}

export function FaceZla() {
  return (
    <Face>
      <path d="M27 40l16 6" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M73 40l-16 6" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="35" cy="53" r="3" fill={STROKE} />
      <circle cx="65" cy="53" r="3" fill={STROKE} />
      <path d="M32 72c8-6 28-6 36 0" stroke={STROKE} strokeWidth="4" strokeLinecap="round" fill="none" />
    </Face>
  )
}

export function FaceGlodna() {
  return (
    <Face>
      <circle cx="35" cy="40" r="3.5" fill={STROKE} />
      <circle cx="65" cy="40" r="3.5" fill={STROKE} />
      <ellipse cx="50" cy="56" rx="7" ry="5" fill={STROKE} />
      <path d="M28 78c0 9 10 15 22 15s22-6 22-15z" fill={SUN} />
      <path d="M26 78h48" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
    </Face>
  )
}

export const FACE_ICONS: Record<string, () => ReactNode> = {
  radosna: FaceRadosna,
  smutna: FaceSmutna,
  zmeczona: FaceZmeczona,
  zla: FaceZla,
  glodna: FaceGlodna
}
