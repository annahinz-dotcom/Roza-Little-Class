import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import RozaModeShell from '../RozaModeShell'
import { getAsset } from '../rozaAssets'
import { WORDS } from './words'

export default function WordPicker() {
  const navigate = useNavigate()

  return (
    <RozaModeShell>
      <button
        onClick={() => navigate('/roza-mode')}
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-navy/50 shadow-soft"
        aria-label="Wróć"
      >
        <FiArrowLeft size={26} />
      </button>

      <h1 className="mb-6 text-center text-3xl font-extrabold text-navy">Ułóż słowo</h1>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:gap-8">
        {WORDS.map((word) => (
          <button
            key={word.id}
            onClick={() => navigate(`/roza-mode/slowo/${word.id}`)}
            className={`flex w-full flex-col items-center gap-3 rounded-card ${word.bg} p-6 shadow-soft transition-transform active:scale-[0.97] [@media(orientation:landscape)]:w-60`}
          >
            <img
              src={getAsset(word.characterAsset).src}
              alt=""
              className="h-28 w-28 rounded-3xl object-cover shadow-softer [@media(orientation:landscape)]:h-32 [@media(orientation:landscape)]:w-32"
            />
            <span className="text-2xl font-extrabold tracking-wide text-navy">{word.label}</span>
          </button>
        ))}
      </div>
    </RozaModeShell>
  )
}
