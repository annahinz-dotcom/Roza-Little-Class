import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import RozaModeShell from './RozaModeShell'
import { getAsset } from './rozaAssets'
import { speak } from './audio'

const TILES = [
  { to: '/roza-mode/slowo', label: 'Ułóż słowo', asset: 'letter-R' as const, bg: 'bg-dusty/20' },
  { to: '/roza-mode/ksztalty', label: 'Kształty', asset: 'shape-kolo' as const, bg: 'bg-honey/20' },
  { to: '/roza-mode/uczucia', label: 'Uczucia', asset: 'feeling-radosna' as const, bg: 'bg-coral/20' },
  { to: '/roza-mode/kolory', label: 'Kolory po angielsku', asset: 'color-balon' as const, bg: 'bg-sage/20' },
  { to: '/roza-mode/wspomnienia', label: 'Moje wspomnienia', asset: 'roza' as const, bg: 'bg-dusty/20' }
]

export default function RozaModeHome() {
  const navigate = useNavigate()

  useEffect(() => {
    speak('roza-mode-welcome', 'Cześć Różo! Co chcesz dzisiaj robić?')
  }, [])

  return (
    <RozaModeShell>
      <div className="mb-6 flex items-center gap-4">
        <img src={getAsset('roza').src} alt="" className="h-16 w-16 rounded-2xl bg-white/50 object-contain p-1 shadow-soft" />
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Cześć, Różo! 🌸</h1>
          <p className="text-base text-navy/50">Co chcesz dzisiaj robić?</p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-5 [@media(orientation:landscape)]:grid-cols-5 [@media(orientation:landscape)]:grid-rows-1">
        {TILES.map((tile) => (
          <button
            key={tile.to}
            onClick={() => navigate(tile.to)}
            className={`flex flex-col items-center justify-center gap-3 rounded-card ${tile.bg} p-5 text-center shadow-soft transition-transform active:scale-[0.97]`}
          >
            <img
              src={getAsset(tile.asset).src}
              alt=""
              className="h-24 w-24 rounded-2xl bg-white/50 object-contain p-2 shadow-softer [@media(orientation:landscape)]:h-28 [@media(orientation:landscape)]:w-28"
            />
            <span className="text-lg font-extrabold leading-tight text-navy">{tile.label}</span>
          </button>
        ))}
      </div>
    </RozaModeShell>
  )
}
