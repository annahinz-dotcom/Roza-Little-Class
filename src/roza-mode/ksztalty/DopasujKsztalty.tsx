import { useEffect, useState } from 'react'
import type * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import ShapeSvg from './ShapeSvg'
import { MATCH_ROUNDS, SHAPES, shuffle, type ShapeId } from './shapes'

const PIECE_CLASS = 'w-[clamp(64px,18vw,150px)] aspect-square'

export default function DopasujKsztalty() {
  const navigate = useNavigate()
  const [roundIndex, setRoundIndex] = useState(0)
  const [slotOrder, setSlotOrder] = useState<ShapeId[]>([])
  const [pieceOrder, setPieceOrder] = useState<ShapeId[]>([])
  const [placed, setPlaced] = useState<Record<ShapeId, boolean>>({} as Record<ShapeId, boolean>)
  const [draggingId, setDraggingId] = useState<ShapeId | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [dragSize, setDragSize] = useState({ w: 100, h: 100 })
  const [rejectId, setRejectId] = useState<ShapeId | null>(null)
  const [roundDone, setRoundDone] = useState(false)

  const round = MATCH_ROUNDS[roundIndex]
  const allDone = roundIndex >= MATCH_ROUNDS.length

  function setupRound(idx: number) {
    const shapes = MATCH_ROUNDS[idx]
    if (!shapes) return
    setSlotOrder(shuffle(shapes))
    setPieceOrder(shuffle(shapes))
    setPlaced(Object.fromEntries(shapes.map((s) => [s, false])) as Record<ShapeId, boolean>)
    setRoundDone(false)
    setDraggingId(null)
  }

  useEffect(() => {
    setupRound(0)
  }, [])

  useEffect(() => {
    if (!draggingId) return
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
  }, [draggingId, placed])

  function startDrag(e: React.PointerEvent, shapeId: ShapeId) {
    if (roundDone) return
    const rect = e.currentTarget.getBoundingClientRect()
    setDragSize({ w: rect.width, h: rect.height })
    setDraggingId(shapeId)
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  function finishDrag(clientX: number, clientY: number) {
    const shapeId = draggingId
    if (!shapeId) return
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
    const slotEl = el?.closest('[data-slot-shape]') as HTMLElement | null
    const slotShape = slotEl?.dataset.slotShape as ShapeId | undefined

    if (slotShape === shapeId && !placed[shapeId]) {
      const next = { ...placed, [shapeId]: true }
      setPlaced(next)
      if (round.every((s) => next[s])) {
        setRoundDone(true)
        setTimeout(() => {
          if (roundIndex + 1 < MATCH_ROUNDS.length) {
            setRoundIndex((i) => i + 1)
            setupRound(roundIndex + 1)
          } else {
            setRoundIndex((i) => i + 1) // triggers allDone
          }
        }, 1400)
      }
    } else {
      setRejectId(shapeId)
      setTimeout(() => setRejectId(null), 400)
    }
    setDraggingId(null)
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
          onClick={() => {
            setRoundIndex(0)
            setupRound(0)
          }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
          aria-label="Zacznij od nowa"
        >
          <FiRotateCcw size={20} />
        </button>
      </div>

      {allDone ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="animate-bounce text-6xl">🌟</div>
          <p className="text-4xl font-extrabold text-navy">Świetnie! Dopasowałaś wszystkie kształty!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setRoundIndex(0)
                setupRound(0)
              }}
              className="rounded-pill bg-honey px-8 py-4 text-xl font-bold text-white shadow-soft"
            >
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
          <p className="text-2xl font-extrabold text-navy">Dopasuj kształty</p>

          <div className="flex flex-wrap justify-center gap-5">
            {slotOrder.map((shapeId) => {
              const def = SHAPES.find((s) => s.id === shapeId)!
              const isFilled = placed[shapeId]
              return (
                <div
                  key={shapeId}
                  data-slot-shape={shapeId}
                  className={`flex items-center justify-center rounded-2xl border-4 border-dashed bg-white/40 p-2 ${PIECE_CLASS}`}
                  style={{ borderColor: `${def.color}55` }}
                >
                  {isFilled ? (
                    <ShapeSvg shapeId={shapeId} color={def.color} />
                  ) : (
                    <div className="opacity-40">
                      <ShapeSvg shapeId={shapeId} color={def.color} mode="outline" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {!roundDone && (
            <div className="flex min-h-[20vw] w-full flex-wrap items-center justify-center gap-5">
              {pieceOrder
                .filter((s) => !placed[s])
                .map((shapeId) => {
                  const def = SHAPES.find((s) => s.id === shapeId)!
                  if (shapeId === draggingId) return <div key={shapeId} className={PIECE_CLASS} />
                  return (
                    <div
                      key={shapeId}
                      onPointerDown={(e) => startDrag(e, shapeId)}
                      style={{ touchAction: 'none' }}
                      className={`cursor-grab p-2 ${PIECE_CLASS} ${rejectId === shapeId ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
                    >
                      <ShapeSvg shapeId={shapeId} color={def.color} />
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {draggingId &&
        (() => {
          const def = SHAPES.find((s) => s.id === draggingId)!
          return (
            <div
              className="pointer-events-none fixed z-50 p-2"
              style={{ left: dragPos.x - dragSize.w / 2, top: dragPos.y - dragSize.h / 2, width: dragSize.w, height: dragSize.h }}
            >
              <ShapeSvg shapeId={draggingId} color={def.color} />
            </div>
          )
        })()}
    </RozaModeShell>
  )
}
