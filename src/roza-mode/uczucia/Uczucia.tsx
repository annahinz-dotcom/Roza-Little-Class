import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset } from '../rozaAssets'
import { FEELING_ROUNDS, shuffle, type FeelingId } from './scenarios'

type Stage = 'feeling' | 'action' | 'outcome'

const CARD_CLASS = 'w-[clamp(140px,32vw,340px)] aspect-[517/724] object-contain'

export default function Uczucia() {
  const navigate = useNavigate()
  const [roundIndex, setRoundIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('feeling')
  const [feelingChoices, setFeelingChoices] = useState<FeelingId[]>([])
  const [actionChoices, setActionChoices] = useState<number[]>([])
  const [wobbleKey, setWobbleKey] = useState<string | null>(null)

  const round = FEELING_ROUNDS[roundIndex]
  const allDone = roundIndex >= FEELING_ROUNDS.length

  function setupRound() {
    if (!round) return
    const others = FEELING_ROUNDS.map((r) => r.id).filter((id) => id !== round.id)
    const distractor = others[Math.floor(Math.random() * others.length)]
    setFeelingChoices(shuffle([round.id, distractor]))

    const otherIdx = FEELING_ROUNDS.map((_, i) => i).filter((i) => i !== roundIndex)
    const distractorIdx = otherIdx[Math.floor(Math.random() * otherIdx.length)]
    setActionChoices(shuffle([roundIndex, distractorIdx]))

    setStage('feeling')
    setWobbleKey(null)
  }

  useEffect(() => {
    setupRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  function pickFeeling(id: FeelingId) {
    if (!round) return
    if (id === round.id) {
      setStage('action')
    } else {
      setWobbleKey(id)
      setTimeout(() => setWobbleKey(null), 400)
    }
  }

  function pickAction(idx: number) {
    if (!round) return
    if (idx === roundIndex) {
      setStage('outcome')
      setTimeout(() => setRoundIndex((i) => i + 1), 1600)
    } else {
      setWobbleKey(`a${idx}`)
      setTimeout(() => setWobbleKey(null), 400)
    }
  }

  return (
    <RozaModeShell>
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/roza-mode')}
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
              onClick={() => navigate('/roza-mode')}
              className="rounded-pill bg-white/70 px-8 py-4 text-xl font-bold text-navy/50 shadow-softer"
            >
              Zakończ
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          {stage === 'feeling' && (
            <>
              <p className="max-w-lg text-2xl font-bold text-navy/70">{round.scenario}</p>
              <p className="text-3xl font-extrabold text-navy">Jak czuje się Róża?</p>
              <div className="flex flex-wrap justify-center gap-6">
                {feelingChoices.map((id) => {
                  const r = FEELING_ROUNDS.find((x) => x.id === id)!
                  return (
                    <button
                      key={id}
                      onClick={() => pickFeeling(id)}
                      className={`overflow-hidden rounded-2xl shadow-soft transition-transform active:scale-95 ${
                        wobbleKey === id ? 'animate-[wobble_0.4s_ease-in-out]' : ''
                      }`}
                    >
                      <img src={getAsset(r.feelingAsset).src} alt="" className={CARD_CLASS} />
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {stage === 'action' && (
            <>
              <p className="text-3xl font-extrabold text-navy">Co może jej pomóc?</p>
              <div className="flex flex-wrap justify-center gap-6">
                {actionChoices.map((idx) => {
                  const r = FEELING_ROUNDS[idx]
                  const key = `a${idx}`
                  return (
                    <button
                      key={key}
                      onClick={() => pickAction(idx)}
                      className={`overflow-hidden rounded-2xl shadow-soft transition-transform active:scale-95 ${
                        wobbleKey === key ? 'animate-[wobble_0.4s_ease-in-out]' : ''
                      }`}
                    >
                      <img src={getAsset(r.actionAsset).src} alt="" className={CARD_CLASS} />
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {stage === 'outcome' && (
            <>
              <p className="text-3xl font-extrabold text-navy">To pomogło! 💛</p>
              <div className="flex flex-wrap justify-center gap-6">
                <img src={getAsset(round.feelingAsset).src} alt="" className={`${CARD_CLASS} ring-4 ring-sage/60`} />
                <img src={getAsset(round.actionAsset).src} alt="" className={`${CARD_CLASS} ring-4 ring-sage/60`} />
              </div>
            </>
          )}
        </div>
      )}
    </RozaModeShell>
  )
}
