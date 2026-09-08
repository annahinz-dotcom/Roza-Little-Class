export type ShapeId = 'kolo' | 'kwadrat' | 'trojkat' | 'serce'

export interface ShapeDef {
  id: ShapeId
  label: string
  color: string
}

// Colours match Róża's own physical trace worksheet exactly: pink for the
// circle, blue for the square, green for the triangle. Serce (heart) reuses
// the coral tone already established for it elsewhere in the app.
export const SHAPES: ShapeDef[] = [
  { id: 'kolo', label: 'Koło', color: '#D98CA8' },
  { id: 'kwadrat', label: 'Kwadrat', color: '#6F91A8' },
  { id: 'trojkat', label: 'Trójkąt', color: '#91A982' },
  { id: 'serce', label: 'Serce', color: '#D97D68' }
]

export function getShape(id: string): ShapeDef | undefined {
  return SHAPES.find((s) => s.id === id)
}

// The gentle difficulty progression from the brief: two shapes, then three,
// then four.
export const MATCH_ROUNDS: ShapeId[][] = [
  ['kolo', 'kwadrat'],
  ['kolo', 'kwadrat', 'trojkat'],
  ['kolo', 'kwadrat', 'trojkat', 'serce']
]

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
