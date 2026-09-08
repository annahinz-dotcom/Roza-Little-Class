import type { ShapeId } from './shapes'

export default function ShapeSvg({
  shapeId,
  color,
  mode = 'solid'
}: {
  shapeId: ShapeId
  color: string
  mode?: 'solid' | 'outline'
}) {
  const common =
    mode === 'outline'
      ? { fill: 'none', stroke: color, strokeWidth: 4, strokeDasharray: '10 8' }
      : { fill: color, stroke: 'none' }

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      {shapeId === 'kolo' && <circle cx="50" cy="50" r="42" {...common} />}
      {shapeId === 'kwadrat' && <rect x="10" y="10" width="80" height="80" rx="10" {...common} />}
      {shapeId === 'trojkat' && <polygon points="50,8 92,88 8,88" strokeLinejoin="round" {...common} />}
      {shapeId === 'serce' && (
        <path
          d="M50 88C20 66 6 46 6 30C6 14 18 4 32 4C40 4 47 8 50 16C53 8 60 4 68 4C82 4 94 14 94 30C94 46 80 66 50 88Z"
          {...common}
        />
      )}
    </svg>
  )
}
