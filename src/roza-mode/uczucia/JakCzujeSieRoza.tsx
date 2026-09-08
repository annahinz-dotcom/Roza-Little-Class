import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset } from '../rozaAssets'
import { FEELINGS, shuffle, type FeelingId } from './scenarios'

const CARD_CLASS = 'w-[clamp(120px,26vw,220px)] aspect-[517/724] object-contain'

export default function JakCzujeSieRoza() {
  const navigate = useNavigate()
  const [roundIndex, setRoundIndex] = useState(0)
  const [choices, setChoices] = useState<FeelingId[]>([])
  const [wobbleId, setWobbleId] = useState<FeelingId | null>(null)
  const [correctFlash, setCorrectFlash] = useState(false)

  const round = FEELINGS[roundIndex]
  const allDone = roundIndex >= FEELINGS.length

  useEffect(() => {
    if (!round) return
    const others = FEELINGS.map((f) => f.id).filter((id) => id !== round.id)
    const distractor = others[Math.floor(Math.random() * others.length)]
    setChoices(shuffle([round.id, distractor]))
    setWobbleId(null)
    setCorrectFlash(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  function pick(id: FeelingId) {
    if (!round || correctFlash) return
    if (id === round.id) {
      setCorrectFlash(true)
      setTimeout(() => setRoundIndex((i) => i + 1), 1200)
    } else {
      setWobbleId(id)
      setTimeout(() => setWobbleId(null), 400)
    }
  }

  return (
    <RozaModeShell>
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/roza-mode/uczucia')}
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
          <p className="text-4xl font-extrabold text-navy">Świetnie Ci poszło!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setRoundIndex(0)} className="rounded-pill bg-honey px-8 py-4 text-xl font-bold text-white shadow-soft">
              Jeszcze raz
            </button>
            <button
              onClick={() => navigate('/roza-mode/uczucia')}
              className="rounded-pill bg-white/70 px-8 py-4 text-xl font-bold text-navy/50 shadow-softer"
            >
              Zakończ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:gap-12">
          <img
            src={getAsset(round.eventAsset).src}
            alt=""
            className="w-[clamp(200px,42vw,420px)] rounded-2xl object-contain shadow-soft"
          />

          <div className="flex flex-col items-center gap-6">
            <p className="text-3xl font-extrabold text-navy">Jak czuje się Róża?</p>
            <div className="flex flex-wrap justify-center gap-6">
              {choices.map((id) => {
                const f = FEELINGS.find((x) => x.id === id)!
                const isCorrectTapped = correctFlash && id === round.id
                return (
                  <button
                    key={id}
                    onClick={() => pick(id)}
                    className={`overflow-hidden rounded-2xl shadow-soft transition-transform active:scale-95 ${
                      isCorrectTapped ? 'scale-110 ring-4 ring-sage' : ''
                    } ${wobbleId === id ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
                  >
                    <img src={getAsset(f.feelingAsset).src} alt={f.label} className={CARD_CLASS} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </RozaModeShell>
  )
}
