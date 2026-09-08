import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiVolume2 } from 'react-icons/fi'
import RozaModeShell from './RozaModeShell'
import { speak } from './audio'

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

  const say = () => speak(`stub-${title}`, message)

  useEffect(() => {
    say()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <button
          onClick={say}
          className="flex items-center gap-2 rounded-pill bg-dusty/20 px-6 py-3 text-base font-bold text-dusty-dark"
        >
          <FiVolume2 size={20} /> Posłuchaj jeszcze raz
        </button>
      </div>
    </RozaModeShell>
  )
}
