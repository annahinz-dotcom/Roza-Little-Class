import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset, type AssetId } from '../rozaAssets'
import { shuffle, type ShapeId } from './shapes'

interface Round {
  shapeId: ShapeId
  prompt: string
}

const ROUNDS: Round[] = [
  { shapeId: 'kolo', prompt: 'Znajdź koło.' },
  { shapeId: 'kwadrat', prompt: 'Gdzie jest kwadrat?' },
  { shapeId: 'trojkat', prompt: 'Znajdź trójkąt.' },
  { shapeId: 'serce', prompt: 'Dotknij serca.' }
]

const OBJECTS: Record<ShapeId, AssetId> = {
  kolo: 'color-balon',
  kwadrat: 'color-kostka',
  trojkat: 'object-roof',
  serce: 'shape-serce'
}

export default function ZnajdzKsztalt() {
  const navigate = useNavigate()
  const [roundIndex, setRoundIndex] = useState(0)
  const [order, setOrder] = useState<ShapeId[]>([])
  const [correctId, setCorrectId] = useState<ShapeId | null>(null)
  const [wobbleId, setWobbleId] = useState<ShapeId | null>(null)

  function setup(idx: number) {
    setOrder(shuffle(Object.keys(OBJECTS) as ShapeId[]))
    setCorrectId(null)
    setWobbleId(null)
    void idx
  }

  useEffect(() => {
    setup(roundIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  const round = ROUNDS[roundIndex]
  const allDone = roundIndex >= ROUNDS.length

  function handleTap(shapeId: ShapeId) {
    if (correctId) return
    if (shapeId === round.shapeId) {
      setCorrectId(shapeId)
      setTimeout(() => setRoundIndex((i) => i + 1), 1100)
    } else {
      setWobbleId(shapeId)
      setTimeout(() => setWobbleId(null), 400)
    }
  }

  return (
    <RozaModeShell>
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/roza-mode/ksztalty')}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
          aria-label="Wróć"
        >
          <FiArrowLeft size={22} />
        </button>
        <button
          onClick={() => setRoundIndex(0)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
          aria-label="Zacznij od nowa"
        >
          <FiRotateCcw size={20} />
        </button>
      </div>

      {allDone ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="animate-bounce text-6xl">🌟</div>
          <p className="text-4xl font-extrabold text-navy">Świetnie! Znalazłaś wszystkie kształty!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setRoundIndex(0)} className="rounded-pill bg-honey px-8 py-4 text-xl font-bold text-white shadow-soft">
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
          <p className="text-center text-3xl font-extrabold text-navy">{round.prompt}</p>

          <div className="flex flex-wrap justify-center gap-5">
            {order.map((shapeId) => {
              const isCorrectTapped = correctId === shapeId
              const isWobbling = wobbleId === shapeId
              return (
                <button
                  key={shapeId}
                  onClick={() => handleTap(shapeId)}
                  className={`overflow-hidden rounded-2xl shadow-soft transition-transform w-[clamp(90px,20vw,180px)] aspect-[517/724] ${
                    isCorrectTapped ? 'scale-110 ring-4 ring-sage' : ''
                  } ${isWobbling ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
                >
                  <img
                    src={getAsset(OBJECTS[shapeId]).src}
                    alt={getAsset(OBJECTS[shapeId]).alt}
                    className="h-full w-full object-contain"
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </RozaModeShell>
  )
}
