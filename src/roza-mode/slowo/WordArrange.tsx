import { useEffect, useMemo, useState } from 'react'
import type * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset, type AssetId } from '../rozaAssets'
import { getWord, shuffle } from './words'

interface Tile {
  id: string
  letter: string
}

// A tile's "home" is either the tray, or the index of the slot it's placed in.
type Home = 'tray' | number

// Letter cards keep their real portrait proportions (matching the physical
// cards) — never force-cropped into a square, per feedback that doing so
// was cutting off the top/bottom of every card.
const TILE_W = 148
const TILE_H = 208

function buildTiles(letters: string[]): Tile[] {
  return letters.map((letter, i) => ({ id: `${letter}-${i}-${Math.random().toString(36).slice(2, 7)}`, letter }))
}

export default function WordArrange() {
  const { wordId } = useParams<{ wordId: string }>()
  const navigate = useNavigate()
  const word = wordId ? getWord(wordId) : undefined

  const [tiles, setTiles] = useState<Tile[]>([])
  const [homes, setHomes] = useState<Record<string, Home>>({})
  const [trayOrder, setTrayOrder] = useState<string[]>([])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [rejectId, setRejectId] = useState<string | null>(null)

  function setup() {
    if (!word) return
    const newTiles = buildTiles(word.letters)
    setTiles(newTiles)
    setHomes(Object.fromEntries(newTiles.map((t) => [t.id, 'tray' as Home])))
    setTrayOrder(shuffle(newTiles.map((t) => t.id)))
    setDraggingId(null)
  }

  useEffect(() => {
    setup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordId])

  // Dragging is handled with window-level listeners rather than per-element
  // pointer capture + handlers. Capturing on the tile itself broke as soon
  // as that tile's DOM node was swapped out on the next render (which we do,
  // to visually lift it out of the tray) — the browser silently releases
  // capture the moment its element unmounts, so the drag would die after
  // the very first move. Listening on window sidesteps that entirely.
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
  }, [draggingId, homes])

  const complete = useMemo(() => {
    if (!word) return false
    return word.letters.every((_, i) => Object.values(homes).includes(i))
  }, [homes, word])

  if (!word) {
    return (
      <RozaModeShell>
        <p className="text-center text-navy/50">Nie znaleziono słowa.</p>
      </RozaModeShell>
    )
  }

  function startDrag(e: React.PointerEvent, tileId: string) {
    if (complete) return
    setDraggingId(tileId)
    setDragPos({ x: e.clientX, y: e.clientY })
    setHomes((prev) => (prev[tileId] === 'tray' ? prev : { ...prev, [tileId]: 'tray' }))
  }

  function finishDrag(clientX: number, clientY: number) {
    const tileId = draggingId
    if (!tileId || !word) {
      setDraggingId(null)
      return
    }
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null
    const slotEl = el?.closest('[data-slot-index]') as HTMLElement | null
    const slotIndex = slotEl ? Number(slotEl.dataset.slotIndex) : null

    const tile = tiles.find((t) => t.id === tileId)
    const slotAlreadyFilled = slotIndex !== null && Object.values(homes).includes(slotIndex)
    const letterMatches = slotIndex !== null && tile && word.letters[slotIndex] === tile.letter

    if (slotIndex !== null && !slotAlreadyFilled && letterMatches) {
      setHomes((prev) => ({ ...prev, [tileId]: slotIndex }))
    } else {
      setHomes((prev) => ({ ...prev, [tileId]: 'tray' }))
      if (slotIndex !== null) {
        setRejectId(tileId)
        setTimeout(() => setRejectId(null), 400)
      }
      setTrayOrder((prev) => (prev.includes(tileId) ? prev : [...prev, tileId]))
    }
    setDraggingId(null)
  }

  const trayTileIds = trayOrder.filter((id) => homes[id] === 'tray')

  return (
    <RozaModeShell>
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/roza-mode/slowo')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
          aria-label="Wróć"
        >
          <FiArrowLeft size={22} />
        </button>
        <button
          onClick={setup}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
          aria-label="Zacznij od nowa"
        >
          <FiRotateCcw size={20} />
        </button>
      </div>

      {complete ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="animate-bounce text-6xl">🌟</div>
          <p className="text-4xl font-extrabold text-navy">Świetnie! Ułożyłaś {word.label}!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={setup} className="rounded-pill bg-honey px-8 py-4 text-xl font-bold text-white shadow-soft">
              Jeszcze raz
            </button>
            <button
              onClick={() => navigate('/roza-mode/slowo')}
              className="rounded-pill bg-dusty/20 px-8 py-4 text-xl font-bold text-dusty-dark"
            >
              Wybierz inne słowo
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
        <div className="flex flex-1 flex-col items-center justify-center gap-10 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:items-center [@media(orientation:landscape)]:gap-14">
          {/* big reference: character + word */}
          <div className="flex flex-row items-center gap-4 [@media(orientation:landscape)]:flex-col [@media(orientation:landscape)]:gap-6">
            <img
              src={getAsset(word.characterAsset).src}
              alt=""
              className="h-32 w-32 rounded-[2rem] object-cover shadow-soft [@media(orientation:landscape)]:h-64 [@media(orientation:landscape)]:w-64"
            />
            <span className="text-4xl font-extrabold tracking-widest text-navy [@media(orientation:landscape)]:text-5xl">
              {word.label}
            </span>
          </div>

          <div className="flex flex-col items-center gap-10">
            {/* slots */}
            <div className="flex gap-4">
              {word.letters.map((letter, i) => {
                const filledTileId = Object.entries(homes).find(([, home]) => home === i)?.[0]
                const filledTile = filledTileId ? tiles.find((t) => t.id === filledTileId) : null
                const isDraggingThis = filledTileId === draggingId
                return (
                  <div
                    key={i}
                    data-slot-index={i}
                    className="flex items-center justify-center rounded-2xl border-4 border-dashed border-navy/15 bg-white/40"
                    style={{ width: TILE_W, height: TILE_H }}
                  >
                    {filledTile && !isDraggingThis && (
                      <LetterTile
                        tile={filledTile}
                        asset={word.letterAsset[filledTile.letter]}
                        onPointerDown={(e) => startDrag(e, filledTile.id)}
                        rejecting={false}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* tray */}
            <div className="flex min-h-[220px] flex-wrap items-center justify-center gap-4">
              {trayTileIds.map((tileId) => {
                const tile = tiles.find((t) => t.id === tileId)!
                if (tileId === draggingId) return <div key={tileId} style={{ width: TILE_W, height: TILE_H }} />
                return (
                  <LetterTile
                    key={tileId}
                    tile={tile}
                    asset={word.letterAsset[tile.letter]}
                    onPointerDown={(e) => startDrag(e, tile.id)}
                    rejecting={rejectId === tileId}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* floating dragged tile */}
      {draggingId &&
        (() => {
          const tile = tiles.find((t) => t.id === draggingId)
          if (!tile) return null
          return (
            <div
              className="pointer-events-none fixed z-50"
              style={{ left: dragPos.x - TILE_W / 2, top: dragPos.y - TILE_H / 2 }}
            >
              <LetterTileVisual asset={word.letterAsset[tile.letter]} floating />
            </div>
          )
        })()}
    </RozaModeShell>
  )
}

function LetterTile({
  tile,
  asset,
  onPointerDown,
  rejecting
}: {
  tile: Tile
  asset: AssetId
  onPointerDown: (e: React.PointerEvent) => void
  rejecting: boolean
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      style={{ touchAction: 'none', width: TILE_W, height: TILE_H }}
      className={`cursor-grab ${rejecting ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
      key={tile.id}
    >
      <LetterTileVisual asset={asset} />
    </div>
  )
}

function LetterTileVisual({ asset, floating = false }: { asset: AssetId; floating?: boolean }) {
  return (
    <img
      src={getAsset(asset).src}
      alt={getAsset(asset).alt}
      draggable={false}
      className={`h-full w-full rounded-2xl object-contain ${floating ? 'shadow-soft scale-105' : 'shadow-softer'}`}
      style={{ width: TILE_W, height: TILE_H }}
    />
  )
}
