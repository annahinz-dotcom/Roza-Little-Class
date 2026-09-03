interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill border px-4 py-2 text-sm font-semibold transition-colors ${
        selected
          ? 'border-honey bg-honey text-white shadow-softer'
          : 'border-navy/10 bg-white text-navy/70 hover:border-honey/50'
      }`}
    >
      {label}
    </button>
  )
}
