import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset, type AssetId } from '../rozaAssets'
import type { ShapeId } from './shapes'

interface Step {
  shapeId: ShapeId
  asset: AssetId
  prompt: string
}

const STEPS: Step[] = [
  { shapeId: 'kolo', asset: 'shape-kolo', prompt: 'Zbuduj koło z kostek.' },
  { shapeId: 'kwadrat', asset: 'shape-kwadrat', prompt: 'Zbuduj kwadrat z patyczków.' },
  { shapeId: 'trojkat', asset: 'shape-trojkat', prompt: 'Ułóż trójkąt z patyczków.' },
  { shapeId: 'serce', asset: 'shape-serce', prompt: 'Ułóż serce z filcu lub pianki.' }
]

export default function ZbudujKsztalt() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [pulse, setPulse] = useState(false)
  const done = index >= STEPS.length

  function showAgain() {
    setPulse(true)
    setTimeout(() => setPulse(false), 500)
  }

  return (
    <RozaModeShell>
      <button
        onClick={() => navigate('/roza-mode/ksztalty')}
        className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
        aria-label="Wróć"
      >
        <FiArrowLeft size={22} />
      </button>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="animate-bounce text-6xl">🌟</div>
          <p className="text-4xl font-extrabold text-navy">Świetna zabawa!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setIndex(0)} className="rounded-pill bg-honey px-8 py-4 text-xl font-bold text-white shadow-soft">
              Jeszcze raz
            </button>
            <button
              onClick={() => navigate('/roza-mode/ksztalty')}
              className="rounded-pill bg-white/70 px-8 py-4 text-xl font-bold text-navy/50 shadow-softer"
            >
              Zakończ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <p className="max-w-lg text-center text-3xl font-extrabold text-navy">{STEPS[index].prompt}</p>
          <img
            src={getAsset(STEPS[index].asset).src}
            alt=""
            className={`w-[clamp(220px,50vw,420px)] rounded-3xl object-contain shadow-soft transition-transform ${pulse ? 'scale-105' : ''}`}
          />
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={showAgain} className="rounded-pill bg-dusty/20 px-7 py-4 text-lg font-bold text-dusty-dark">
              Pokaż mi jeszcze raz
            </button>
            <button
              onClick={() => setIndex((i) => i + 1)}
              className="rounded-pill bg-honey px-7 py-4 text-lg font-bold text-white shadow-soft"
            >
              Gotowe!
            </button>
          </div>
        </div>
      )}
    </RozaModeShell>
  )
}
