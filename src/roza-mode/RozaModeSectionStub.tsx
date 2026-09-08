import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import RozaModeShell from './RozaModeShell'

export default function RozaModeSectionStub({
  title,
  message,
  icon
}: {
  title: string
  message: string
  icon: ReactNode
}) {
  const navigate = useNavigate()

  return (
    <RozaModeShell>
      <button
        onClick={() => navigate('/roza-mode')}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
        aria-label="Wróć"
      >
        <FiArrowLeft size={26} />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="h-40 w-40">{icon}</div>
        <h1 className="text-3xl font-extrabold text-navy">{title}</h1>
        <p className="max-w-md text-lg text-navy/60">{message}</p>
      </div>
    </RozaModeShell>
  )
}
