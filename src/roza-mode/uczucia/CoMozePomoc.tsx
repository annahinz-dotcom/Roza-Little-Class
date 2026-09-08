import { useEffect, useState } from 'react'
import type * as React from 'react'
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
  const [solved, setSolved] = useState(false)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [dragSize, setDragSize] = useState({ w: 100, h: 140 })
  const [rejectIdx, setRejectIdx] = useState<number | null>(null)

  const round = FEELINGS[roundIndex]
  const allDone = roundIndex >= FEELINGS.length

  useEffect(() => {
    if (!round) return
    const others = FEELINGS.map((_, i) => i).filter((i) => i !== roundIndex)
    const distractor = others[Math.floor(Math.random() * others.length)]
    setChoiceIdxs(shuffle([roundIndex, distractor]))
    setSolved(false)
    setDraggingIdx(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  useEffect(() => {
    if (draggingIdx === null) return
    function onMove(e: PointerEvent) {
      e.preventDefault()
      setDragPos({ x: e.clientX, y: e.clientY })
    }
    function onUp(e: PointerEvent) {
      finishDrag(e.clientX, e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingIdx])

  function startDrag(e: React.PointerEvent, idx: number) {
    if (solved) return
    const rect = e.currentTarget.getBoundingClientRect()
    setDragSize({ w: rect.width, h: rect.height })
    setDraggingIdx(idx)
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  function finishDrag(clientX: number, clientY: number) {
    const idx = draggingIdx
    setDraggingIdx(null)
    if (idx === null) return
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
    const dropZone = el?.closest('[data-drop-zone]')
    if (dropZone && idx === roundIndex) {
      setSolved(true)
      setTimeout(() => setRoundIndex((i) => i + 1), 1500)
    } else if (dropZone) {
      setRejectIdx(idx)
      setTimeout(() => setRejectIdx(null), 400)
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
        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <p className="text-3xl font-extrabold text-navy">Co może pomóc?</p>

          <div
            data-drop-zone
            className={`flex items-center justify-center rounded-3xl border-4 border-dashed p-3 transition-colors ${
              solved ? 'border-sage bg-sage/15' : 'border-navy/15 bg-white/40'
            }`}
          >
            <img src={getAsset(round.feelingAsset).src} alt={round.label} className={CARD_CLASS} />
          </div>

          {!solved && (
            <div className="flex flex-wrap justify-center gap-6">
              {choiceIdxs.map((idx) => {
                const f = FEELINGS[idx]
                if (idx === draggingIdx) return <div key={idx} className={CARD_CLASS} />
                return (
                  <div
                    key={idx}
                    onPointerDown={(e) => startDrag(e, idx)}
                    style={{ touchAction: 'none' }}
                    className={`cursor-grab overflow-hidden rounded-2xl shadow-soft ${
                      rejectIdx === idx ? 'animate-[wobble_0.4s_ease-in-out]' : ''
                    }`}
                  >
                    <img src={getAsset(f.actionAsset).src} alt={f.actionLabel} className={CARD_CLASS} draggable={false} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {draggingIdx !== null &&
        (() => {
          const f = FEELINGS[draggingIdx]
          return (
            <div
              className="pointer-events-none fixed z-50"
              style={{ left: dragPos.x - dragSize.w / 2, top: dragPos.y - dragSize.h / 2, width: dragSize.w, height: dragSize.h }}
            >
              <img src={getAsset(f.actionAsset).src} alt="" className="h-full w-full rounded-2xl object-contain shadow-soft" />
            </div>
          )
        })()}
    </RozaModeShell>
  )
}
