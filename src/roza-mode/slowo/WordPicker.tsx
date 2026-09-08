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

      <div className="flex flex-1 flex-col items-center justify-center gap-6 [@media(orientation:landscape)]:flex-row [@media(orientation:landscape)]:gap-10">
        {WORDS.map((word) => (
          <button
            key={word.id}
            onClick={() => navigate(`/roza-mode/slowo/${word.id}`)}
            className={`flex w-full flex-col items-center justify-center rounded-card ${word.bg} p-8 shadow-soft transition-transform active:scale-[0.97] [@media(orientation:landscape)]:w-80`}
          >
            <img
              src={getAsset(word.fullCardAsset).src}
              alt={word.label}
              className="h-72 w-auto object-contain shadow-soft [@media(orientation:landscape)]:h-96"
            />
          </button>
        ))}
      </div>
    </RozaModeShell>
  )
}
