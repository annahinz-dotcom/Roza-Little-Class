import { useEffect, useMemo, useRef, useState } from 'react'
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

  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const tileSize = 84

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

  function handlePointerDown(e: React.PointerEvent, tileId: string) {
    if (complete) return
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDraggingId(tileId)
    setDragPos({ x: e.clientX, y: e.clientY })
    // picking a tile back up out of a slot empties that slot immediately
    setHomes((prev) => (prev[tileId] === 'tray' ? prev : { ...prev, [tileId]: 'tray' }))
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingId) return
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  function handlePointerUp(e: React.PointerEvent, tileId: string) {
    if (!draggingId || !word) return
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const slotEl = el?.closest('[data-slot-index]') as HTMLElement | null
    const slotIndex = slotEl ? Number(slotEl.dataset.slotIndex) : null

    const tile = tiles.find((t) => t.id === tileId)
    const slotAlreadyFilled = slotIndex !== null && Object.values(homes).includes(slotIndex)
    const letterMatches = slotIndex !== null && tile && word.letters[slotIndex] === tile.letter

    if (slotIndex !== null && !slotAlreadyFilled && letterMatches) {
      setHomes((prev) => ({ ...prev, [tileId]: slotIndex }))
    } else {
      // gentle reject: stays/returns to tray, with a brief wobble if a real attempt was made
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

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        {/* reference: character + full word */}
        <div className="flex items-center gap-4">
          <img src={getAsset(word.characterAsset).src} alt="" className="h-16 w-16 rounded-2xl object-cover shadow-softer" />
          <span className="text-3xl font-extrabold tracking-widest text-navy/70">{word.label}</span>
        </div>

        {/* slots */}
        <div className="flex gap-4">
          {word.letters.map((letter, i) => {
            const filledTileId = Object.entries(homes).find(([, home]) => home === i)?.[0]
            const filledTile = filledTileId ? tiles.find((t) => t.id === filledTileId) : null
            const isDraggingThis = filledTileId === draggingId
            return (
              <div
                key={i}
                ref={(el) => (slotRefs.current[i] = el)}
                data-slot-index={i}
                className="flex items-center justify-center rounded-2xl border-4 border-dashed border-navy/15 bg-white/40"
                style={{ width: tileSize, height: tileSize }}
              >
                {filledTile && !isDraggingThis && (
                  <LetterTile
                    tile={filledTile}
                    asset={word.letterAsset[filledTile.letter]}
                    size={tileSize - 10}
                    onPointerDown={(e) => handlePointerDown(e, filledTile.id)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(e) => handlePointerUp(e, filledTile.id)}
                    rejecting={false}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* tray */}
        {!complete && (
          <div className="flex min-h-[100px] flex-wrap items-center justify-center gap-4">
            {trayTileIds.map((tileId) => {
              const tile = tiles.find((t) => t.id === tileId)!
              if (tileId === draggingId) return <div key={tileId} style={{ width: tileSize, height: tileSize }} />
              return (
                <LetterTile
                  key={tileId}
                  tile={tile}
                  asset={word.letterAsset[tile.letter]}
                  size={tileSize}
                  onPointerDown={(e) => handlePointerDown(e, tile.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, tile.id)}
                  rejecting={rejectId === tileId}
                />
              )
            })}
          </div>
        )}

        {complete && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="animate-bounce text-5xl">🌟</div>
            <p className="text-2xl font-extrabold text-navy">Świetnie! Ułożyłaś {word.label}!</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={setup} className="rounded-pill bg-honey px-6 py-3 text-base font-bold text-white shadow-soft">
                Jeszcze raz
              </button>
              <button
                onClick={() => navigate('/roza-mode/slowo')}
                className="rounded-pill bg-dusty/20 px-6 py-3 text-base font-bold text-dusty-dark"
              >
                Wybierz inne słowo
              </button>
              <button
                onClick={() => navigate('/roza-mode')}
                className="rounded-pill bg-white/70 px-6 py-3 text-base font-bold text-navy/50 shadow-softer"
              >
                Zakończ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* floating dragged tile */}
      {draggingId &&
        (() => {
          const tile = tiles.find((t) => t.id === draggingId)
          if (!tile) return null
          return (
            <div
              className="pointer-events-none fixed z-50"
              style={{ left: dragPos.x - tileSize / 2, top: dragPos.y - tileSize / 2 }}
            >
              <LetterTileVisual asset={word.letterAsset[tile.letter]} size={tileSize} floating />
            </div>
          )
        })()}
    </RozaModeShell>
  )
}

function LetterTile({
  tile,
  asset,
  size,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  rejecting
}: {
  tile: Tile
  asset: AssetId
  size: number
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  rejecting: boolean
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ touchAction: 'none', width: size, height: size }}
      className={`cursor-grab transition-transform ${rejecting ? 'animate-[wobble_0.4s_ease-in-out]' : ''}`}
      key={tile.id}
    >
      <LetterTileVisual asset={asset} size={size} />
    </div>
  )
}

function LetterTileVisual({ asset, size, floating = false }: { asset: AssetId; size: number; floating?: boolean }) {
  return (
    <img
      src={getAsset(asset).src}
      alt={getAsset(asset).alt}
      draggable={false}
      className={`rounded-xl object-cover ${floating ? 'shadow-soft scale-110' : 'shadow-softer'}`}
      style={{ width: size, height: size }}
    />
  )
}
