import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import ShapeSvg from './ShapeSvg'

const ACTIVITIES = [
  {
    to: '/roza-mode/ksztalty/dopasuj',
    label: 'Dopasuj kształty',
    bg: 'bg-dusty/30',
    shapes: [
      { id: 'kolo' as const, color: '#D98CA8' },
      { id: 'kwadrat' as const, color: '#6F91A8' }
    ]
  },
  {
    to: '/roza-mode/ksztalty/znajdz',
    label: 'Znajdź kształt',
    bg: 'bg-honey/30',
    shapes: [
      { id: 'trojkat' as const, color: '#91A982' },
      { id: 'serce' as const, color: '#D97D68' }
    ]
  }
]

export default function KsztaltyPicker() {
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

      <h1 className="mb-6 text-center text-3xl font-extrabold text-navy">Kształty</h1>

      <div className="flex flex-1 flex-col flex-wrap items-center justify-center gap-6 [@media(orientation:landscape)]:flex-row">
        {ACTIVITIES.map((a) => (
          <button
            key={a.to}
            onClick={() => navigate(a.to)}
            className={`flex w-full max-w-xs flex-col items-center justify-center gap-4 rounded-card ${a.bg} p-8 shadow-soft transition-transform active:scale-[0.97] [@media(orientation:landscape)]:w-[clamp(200px,26vw,320px)]`}
          >
            <div className="flex gap-3">
              {a.shapes.map((s) => (
                <div key={s.id} className="h-20 w-20 sm:h-24 sm:w-24">
                  <ShapeSvg shapeId={s.id} color={s.color} />
                </div>
              ))}
            </div>
            <span className="text-center text-xl font-extrabold leading-tight text-navy sm:text-2xl">{a.label}</span>
          </button>
        ))}
      </div>
    </RozaModeShell>
  )
}
