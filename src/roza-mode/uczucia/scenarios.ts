import type { AssetId } from '../rozaAssets'

export type FeelingId = 'radosna' | 'smutna' | 'zmeczona' | 'zla' | 'glodna'

export interface FeelingDef {
  id: FeelingId
  label: string
  feelingAsset: AssetId
  eventAsset: AssetId
  actionAsset: AssetId
  actionLabel: string
}

export const FEELINGS: FeelingDef[] = [
  {
    id: 'radosna',
    label: 'Radosna',
    feelingAsset: 'feeling-radosna',
    eventAsset: 'event-radosna',
    actionAsset: 'action-taniec',
    actionLabel: 'Taniec'
  },
  {
    id: 'smutna',
    label: 'Smutna',
    feelingAsset: 'feeling-smutna',
    eventAsset: 'event-smutna',
    actionAsset: 'action-przytulenie',
    actionLabel: 'Przytulenie'
  },
  {
    id: 'zmeczona',
    label: 'Zmęczona',
    feelingAsset: 'feeling-zmeczona',
    eventAsset: 'event-zmeczona',
    actionAsset: 'action-odpoczynek',
    actionLabel: 'Odpoczynek'
  },
  {
    id: 'zla',
    label: 'Zła',
    feelingAsset: 'feeling-zla',
    eventAsset: 'event-zla',
    actionAsset: 'action-oddech',
    actionLabel: 'Spokojny oddech'
  },
  {
    id: 'glodna',
    label: 'Głodna',
    feelingAsset: 'feeling-glodna',
    eventAsset: 'event-glodna',
    actionAsset: 'action-jedzenie',
    actionLabel: 'Jedzenie'
  }
]

export function getFeeling(id: string): FeelingDef | undefined {
  return FEELINGS.find((f) => f.id === id)
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
