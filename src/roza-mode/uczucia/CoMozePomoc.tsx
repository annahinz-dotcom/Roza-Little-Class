import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset } from '../rozaAssets'
import { FEELINGS, shuffle } from './scenarios'

const CARD_CLASS = 'w-[clamp(120px,26vw,220px)] aspect-[517/724] object-contain'

export default function CoMozePomoc() {
  const navigate = useNavigate()
  const [roundIndex, setRoundIndex] = useState(0)
  const [choiceIdxs, setChoiceIdxs] = useState<number[]>([])
  const [wobbleIdx, setWobbleIdx] = useState<number | null>(null)
  const [correctFlash, setCorrectFlash] = useState(false)

  const round = FEELINGS[roundIndex]
  const allDone = roundIndex >= FEELINGS.length

  useEffect(() => {
    if (!round) return
    const others = FEELINGS.map((_, i) => i).filter((i) => i !== roundIndex)
    const distractor = others[Math.floor(Math.random() * others.length)]
    setChoiceIdxs(shuffle([roundIndex, distractor]))
    setWobbleIdx(null)
    setCorrectFlash(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  function pick(idx: number) {
    if (!round || correctFlash) return
    if (idx === roundIndex) {
      setCorrectFlash(true)
      setTimeout(() => setRoundIndex((i) => i + 1), 1200)
    } else {
      setWobbleIdx(idx)
      setTimeout(() => setWobbleIdx(null), 400)
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
          <p className="text-4xl font-extrabold text-navy">Brawo, dobrze jej pomogłaś!</p>
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
        <div className="flex flex-1 flex-col items-center justify-center gap-8 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:gap-14">
          <img src={getAsset(round.feelingAsset).src} alt={round.label} className={`${CARD_CLASS} shadow-soft`} />

          <div className="flex flex-col items-center gap-6">
            <p className="text-3xl font-extrabold text-navy">Co może pomóc?</p>
            <div className="flex flex-wrap justify-center gap-6">
              {choiceIdxs.map((idx) => {
                const f = FEELINGS[idx]
                const isCorrectTapped = correctFlash && idx === roundIndex
                return (
                  <button
                    key={idx}
                    onClick={() => pick(idx)}
                    className={`overflow-hidden rounded-2xl shadow-soft transition-transform active:scale-95 ${
                      isCorrectTapped ? 'scale-110 ring-4 ring-sage' : ''
                    } ${wobbleIdx === idx ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
                  >
                    <img src={getAsset(f.actionAsset).src} alt={f.actionLabel} className={CARD_CLASS} />
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
