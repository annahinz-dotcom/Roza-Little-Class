import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'

const HOLD_MS = 2200

/**
 * A small, quiet control that only acts after being held down continuously
 * for HOLD_MS. A three-year-old's brief taps never trigger it; releasing
 * early cancels and resets to zero, so there's no partial-progress trick.
 */
export default function AdultGate() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    startRef.current = null
    setProgress(0)
  }, [])

  const tick = useCallback(
    (t: number) => {
      if (startRef.current === null) startRef.current = t
      const elapsed = t - startRef.current
      const pct = Math.min(1, elapsed / HOLD_MS)
      setProgress(pct)
      if (pct >= 1) {
        cancel()
        navigate('/')
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [cancel, navigate]
  )

  const start = useCallback(() => {
    startRef.current = null
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const circumference = 2 * Math.PI * 18

  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-pill bg-white/85 py-2 pl-2 pr-4 text-navy/50 shadow-soft backdrop-blur"
      aria-label="Przytrzymaj, aby wyjść (dla rodzica)"
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" className="absolute -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(36,55,70,0.1)" strokeWidth="4" />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="#91A982"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <FiLock size={15} />
      </span>
      <span className="text-xs font-bold leading-tight">
        Rodzic:
        <br />
        przytrzymaj
      </span>
    </button>
  )
}
