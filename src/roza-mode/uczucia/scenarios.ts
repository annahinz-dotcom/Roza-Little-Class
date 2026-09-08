import type { AssetId } from '../rozaAssets'

export type FeelingId = 'radosna' | 'smutna' | 'zmeczona' | 'zla' | 'glodna'

export interface FeelingRound {
  id: FeelingId
  scenario: string
  feelingAsset: AssetId
  actionAsset: AssetId
  actionLabel: string
}

export const FEELING_ROUNDS: FeelingRound[] = [
  {
    id: 'radosna',
    scenario: 'Róża dostała cudowną niespodziankę!',
    feelingAsset: 'feeling-radosna',
    actionAsset: 'action-taniec',
    actionLabel: 'Taniec'
  },
  {
    id: 'smutna',
    scenario: 'Lody Róży spadły na ziemię.',
    feelingAsset: 'feeling-smutna',
    actionAsset: 'action-przytulenie',
    actionLabel: 'Przytulenie'
  },
  {
    id: 'zmeczona',
    scenario: 'Róża bawiła się bardzo długo i teraz ziewa.',
    feelingAsset: 'feeling-zmeczona',
    actionAsset: 'action-odpoczynek',
    actionLabel: 'Odpoczynek'
  },
  {
    id: 'zla',
    scenario: 'Wieża z klocków Róży się przewróciła.',
    feelingAsset: 'feeling-zla',
    actionAsset: 'action-oddech',
    actionLabel: 'Spokojny oddech'
  },
  {
    id: 'glodna',
    scenario: 'Brzuszek Róży burczy przed obiadem.',
    feelingAsset: 'feeling-glodna',
    actionAsset: 'action-jedzenie',
    actionLabel: 'Jedzenie'
  }
]

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
