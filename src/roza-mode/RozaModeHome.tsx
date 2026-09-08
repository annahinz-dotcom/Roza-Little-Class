import { useNavigate } from 'react-router-dom'
import RozaModeShell from './RozaModeShell'
import { getAsset } from './rozaAssets'
import { SlowoIcon, KsztaltyIcon, UczuciaIcon, EnglishIcon } from './rozaModeIcons'

const TILES = [
  { to: '/roza-mode/slowo', label: 'Ułóż słowo', Icon: SlowoIcon, bg: 'bg-dusty/30' },
  { to: '/roza-mode/ksztalty', label: 'Kształty', Icon: KsztaltyIcon, bg: 'bg-honey/30' },
  { to: '/roza-mode/uczucia', label: 'Uczucia', Icon: UczuciaIcon, bg: 'bg-coral/30' },
  { to: '/roza-mode/kolory', label: 'English', Icon: EnglishIcon, bg: 'bg-sage/30' }
]

export default function RozaModeHome() {
  const navigate = useNavigate()

  return (
    <RozaModeShell>
      <div className="mb-8 flex items-center gap-4">
        <img src={getAsset('roza-face').src} alt="" className="h-16 w-16 rounded-2xl object-cover shadow-soft" />
        <div>
          <h1 className="text-3xl font-extrabold text-navy">Cześć, Różo! 🌸</h1>
          <p className="text-base text-navy/50">Co chcesz dzisiaj robić?</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:gap-6">
        {TILES.map(({ to, label, Icon, bg }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`flex w-full flex-col items-center gap-3 rounded-card ${bg} p-6 shadow-soft transition-transform active:scale-[0.97] [@media(orientation:landscape)]:w-56`}
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
