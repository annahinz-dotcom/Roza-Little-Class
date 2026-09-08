import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import RozaModeShell from './RozaModeShell'
import { getAsset } from './rozaAssets'
import { speak } from './audio'
import { SlowoIcon, KsztaltyIcon, UczuciaIcon, EnglishIcon } from './rozaModeIcons'

const TILES = [
  { to: '/roza-mode/slowo', label: 'Ułóż słowo', Icon: SlowoIcon },
  { to: '/roza-mode/ksztalty', label: 'Kształty', Icon: KsztaltyIcon },
  { to: '/roza-mode/uczucia', label: 'Uczucia', Icon: UczuciaIcon },
  { to: '/roza-mode/kolory', label: 'English', Icon: EnglishIcon }
]

export default function RozaModeHome() {
  const navigate = useNavigate()

  useEffect(() => {
    speak('roza-mode-welcome', 'Cześć Różo! Co chcesz dzisiaj robić?')
  }, [])

  return (
    <RozaModeShell>
      <div className="mb-8 flex items-center gap-4">
        <img src={getAsset('roza').src} alt="" className="h-16 w-16 rounded-2xl bg-white/50 object-contain p-1 shadow-soft" />
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Cześć, Różo! 🌸</h1>
          <p className="text-base text-navy/50">Co chcesz dzisiaj robić?</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:gap-6">
        {TILES.map(({ to, label, Icon }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="flex w-full flex-col items-center gap-3 rounded-card bg-card p-6 shadow-soft transition-transform active:scale-[0.97] [@media(orientation:landscape)]:w-56"
          >
            <div className="h-28 w-28 [@media(orientation:landscape)]:h-32 [@media(orientation:landscape)]:w-32">
              <Icon />
            </div>
            <span className="text-xl font-extrabold leading-tight text-navy">{label}</span>
          </button>
        ))}
      </div>
    </RozaModeShell>
  )
}
