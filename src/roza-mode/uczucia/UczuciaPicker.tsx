import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset } from '../rozaAssets'
import { FaceRadosna } from './FaceIcon'

const ACTIVITIES = [
  { to: '/roza-mode/uczucia/dopasuj-buzie', label: 'Dopasuj buzię', bg: 'bg-dusty/30' },
  { to: '/roza-mode/uczucia/co-moze-pomoc', label: 'Co może pomóc?', bg: 'bg-honey/30' },
  { to: '/roza-mode/uczucia/jak-czuje-sie-roza', label: 'Jak czuje się Róża?', bg: 'bg-coral/30' }
]

export default function UczuciaPicker() {
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

      <h1 className="mb-6 text-center text-3xl font-extrabold text-navy">Uczucia</h1>

      <div className="flex flex-1 flex-col flex-wrap items-center justify-center gap-6 [@media(orientation:landscape)]:flex-row">
        {ACTIVITIES.map((a, i) => (
          <button
            key={a.to}
            onClick={() => navigate(a.to)}
            className={`flex w-full max-w-xs flex-col items-center justify-center gap-4 rounded-card ${a.bg} p-8 shadow-soft transition-transform active:scale-[0.97] [@media(orientation:landscape)]:w-[clamp(200px,26vw,320px)]`}
          >
            {i === 1 ? (
              <img src={getAsset('action-przytulenie').src} alt="" className="h-24 w-auto object-contain sm:h-28" />
            ) : i === 2 ? (
              <img src={getAsset('event-radosna').src} alt="" className="h-24 w-auto rounded-xl object-contain sm:h-28" />
            ) : (
              <div className="h-24 w-24 sm:h-28 sm:w-28">
                <FaceRadosna />
              </div>
            )}
            <span className="text-center text-xl font-extrabold leading-tight text-navy sm:text-2xl">{a.label}</span>
          </button>
        ))}
      </div>
    </RozaModeShell>
  )
}
