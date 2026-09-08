import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import ShapeSvg from './ShapeSvg'
import { SHAPES, shuffle, type ShapeId } from './shapes'

interface Round {
  shapeId: ShapeId
  prompt: string
}

const ROUNDS: Round[] = [
  { shapeId: 'kolo', prompt: 'Znajdź wszystkie koła!' },
  { shapeId: 'kwadrat', prompt: 'Znajdź wszystkie kwadraty!' },
  { shapeId: 'trojkat', prompt: 'Znajdź wszystkie trójkąty!' },
  { shapeId: 'serce', prompt: 'Znajdź wszystkie serca!' }
]

const TARGET_COUNT = 3
const TOTAL_COUNT = 8

interface Item {
  key: string
  shapeId: ShapeId
}

function buildBoard(target: ShapeId): Item[] {
  const others = SHAPES.map((s) => s.id).filter((id) => id !== target)
  const items: ShapeId[] = []
  for (let i = 0; i < TARGET_COUNT; i++) items.push(target)
  for (let i = 0; i < TOTAL_COUNT - TARGET_COUNT; i++) {
    items.push(others[Math.floor(Math.random() * others.length)])
  }
  return shuffle(items).map((shapeId, i) => ({ key: `${shapeId}-${i}-${Math.random().toString(36).slice(2, 6)}`, shapeId }))
}

export default function ZnajdzKsztalt() {
  const navigate = useNavigate()
  const [roundIndex, setRoundIndex] = useState(0)
  const [board, setBoard] = useState<Item[]>([])
  const [found, setFound] = useState<Set<string>>(new Set())
  const [wobbleKey, setWobbleKey] = useState<string | null>(null)

  const round = ROUNDS[roundIndex]
  const allDone = roundIndex >= ROUNDS.length

  useEffect(() => {
    if (!round) return
    setBoard(buildBoard(round.shapeId))
    setFound(new Set())
    setWobbleKey(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  const targetKeys = board.filter((it) => it.shapeId === round?.shapeId).map((it) => it.key)
  const roundComplete = round && targetKeys.length > 0 && targetKeys.every((k) => found.has(k))

  useEffect(() => {
    if (roundComplete) {
      const t = setTimeout(() => setRoundIndex((i) => i + 1), 1100)
      return () => clearTimeout(t)
    }
  }, [roundComplete])

  function handleTap(item: Item) {
    if (!round || found.has(item.key) || roundComplete) return
    if (item.shapeId === round.shapeId) {
      setFound((prev) => new Set(prev).add(item.key))
    } else {
      setWobbleKey(item.key)
      setTimeout(() => setWobbleKey(null), 400)
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

          <div className="flex max-w-3xl flex-wrap items-center justify-center gap-5">
            {board.map((item) => {
              const def = SHAPES.find((s) => s.id === item.shapeId)!
              const isFound = found.has(item.key)
              const isWobbling = wobbleKey === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => handleTap(item)}
                  disabled={isFound}
                  className={`flex items-center justify-center rounded-2xl bg-white/40 p-3 shadow-softer transition-transform w-[clamp(70px,16vw,130px)] aspect-square ${
                    isFound ? 'scale-105 bg-sage/20 ring-4 ring-sage' : 'active:scale-95'
                  } ${isWobbling ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
                >
                  <ShapeSvg shapeId={item.shapeId} color={def.color} />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </RozaModeShell>
  )
}
