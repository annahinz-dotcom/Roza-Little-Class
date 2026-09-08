import type { AssetId } from '../rozaAssets'

export interface WordDef {
  id: string
  label: string
  letters: string[]
  characterAsset: AssetId
  fullCardAsset: AssetId
  letterAsset: Record<string, AssetId>
  bg: string
}

export const WORDS: WordDef[] = [
  {
    id: 'mama',
    label: 'MAMA',
    letters: ['M', 'A', 'M', 'A'],
    characterAsset: 'mama-face',
    fullCardAsset: 'mama',
    letterAsset: { M: 'letter-M', A: 'letter-A' },
    bg: 'bg-dusty/30'
  },
  {
    id: 'tata',
    label: 'TATA',
    letters: ['T', 'A', 'T', 'A'],
    characterAsset: 'tata-face',
    fullCardAsset: 'tata',
    letterAsset: { T: 'letter-T', A: 'letter-A' },
    bg: 'bg-honey/30'
  },
  {
    id: 'roza',
    label: 'RÓŻA',
    letters: ['R', 'Ó', 'Ż', 'A'],
    characterAsset: 'roza-face',
    fullCardAsset: 'roza',
    letterAsset: { R: 'letter-R', Ó: 'letter-O-acute', Ż: 'letter-Z-dot', A: 'letter-A' },
    bg: 'bg-coral/30'
  }
]

export function getWord(id: string): WordDef | undefined {
  return WORDS.find((w) => w.id === id)
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
