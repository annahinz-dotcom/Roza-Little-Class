// Central asset registry for Róża Mode.
// Every image used anywhere in child-facing activities is referenced by a
// stable ID through this file — never imported directly in a component —
// so the same concept always renders the same picture everywhere, and a
// missing asset shows one clear placeholder instead of breaking silently.

import mama from './assets/mama.jpg'
import mamaFace from './assets/mama_face.jpg'
import tata from './assets/tata.jpg'
import tataFace from './assets/tata_face.jpg'
import rozaChar from './assets/roza_char.jpg'
import rozaFace from './assets/roza_face.jpg'
import herkules from './assets/herkules.jpg'

import letterM from './assets/letter_M.jpg'
import letterA from './assets/letter_A.jpg'
import letterT from './assets/letter_T.jpg'
import letterR from './assets/letter_R.jpg'
import letterOacute from './assets/letter_Oacute.jpg'
import letterZdot from './assets/letter_Zdot.jpg'

import feelingRadosna from './assets/feeling_radosna.jpg'
import feelingSmutna from './assets/feeling_smutna.jpg'
import feelingZmeczona from './assets/feeling_zmeczona.jpg'
import feelingZla from './assets/feeling_zla.jpg'
import feelingGlodna from './assets/feeling_glodna.jpg'

import actionTaniec from './assets/action_taniec.jpg'
import actionPrzytulenie from './assets/action_przytulenie.jpg'
import actionOdpoczynek from './assets/action_odpoczynek.jpg'
import actionOddech from './assets/action_oddech.jpg'
import actionJedzenie from './assets/action_jedzenie.jpg'

import colorAuto from './assets/color_auto_red.jpg'
import colorBalon from './assets/color_balon_blue.jpg'
import colorCytryna from './assets/color_cytryna_yellow.jpg'
import colorKostka from './assets/color_kostka_green.png'
import colorKokardka from './assets/color_kokardka_pink.png'

import shapeKolo from './assets/shape_kolo_block.jpg'
import shapeKwadrat from './assets/shape_kwadrat_block.jpg'
import shapeTrojkat from './assets/shape_trojkat_block.jpg'
import shapeSerce from './assets/shape_serce.png'
import objectRoof from './assets/object_roof.png'

export type AssetId =
  | 'mama' | 'mama-face' | 'tata' | 'tata-face' | 'roza' | 'roza-face' | 'herkules'
  | 'letter-M' | 'letter-A' | 'letter-T' | 'letter-R' | 'letter-O-acute' | 'letter-Z-dot'
  | 'feeling-radosna' | 'feeling-smutna' | 'feeling-zmeczona' | 'feeling-zla' | 'feeling-glodna'
  | 'action-taniec' | 'action-przytulenie' | 'action-odpoczynek' | 'action-oddech' | 'action-jedzenie'
  | 'color-auto' | 'color-balon' | 'color-cytryna' | 'color-kostka' | 'color-kokardka'
  | 'shape-kolo' | 'shape-kwadrat' | 'shape-trojkat' | 'shape-serce' | 'object-roof'

interface AssetEntry {
  src: string
  alt: string
  /** true if this was newly created by Claude rather than sourced from Róża's own materials */
  isPlaceholder?: boolean
}

export const ROZA_ASSETS: Record<AssetId, AssetEntry> = {
  mama: { src: mama, alt: 'Mama' },
  'mama-face': { src: mamaFace, alt: 'Mama' },
  tata: { src: tata, alt: 'Tata' },
  'tata-face': { src: tataFace, alt: 'Tata' },
  roza: { src: rozaChar, alt: 'Róża' },
  'roza-face': { src: rozaFace, alt: 'Róża' },
  herkules: { src: herkules, alt: 'Herkules' },

  'letter-M': { src: letterM, alt: 'Litera M' },
  'letter-A': { src: letterA, alt: 'Litera A' },
  'letter-T': { src: letterT, alt: 'Litera T' },
  'letter-R': { src: letterR, alt: 'Litera R' },
  'letter-O-acute': { src: letterOacute, alt: 'Litera Ó' },
  'letter-Z-dot': { src: letterZdot, alt: 'Litera Ż' },

  'feeling-radosna': { src: feelingRadosna, alt: 'Róża jest radosna' },
  'feeling-smutna': { src: feelingSmutna, alt: 'Róża jest smutna' },
  'feeling-zmeczona': { src: feelingZmeczona, alt: 'Róża jest zmęczona' },
  'feeling-zla': { src: feelingZla, alt: 'Róża jest zła' },
  'feeling-glodna': { src: feelingGlodna, alt: 'Róża jest głodna' },

  'action-taniec': { src: actionTaniec, alt: 'Taniec' },
  'action-przytulenie': { src: actionPrzytulenie, alt: 'Przytulenie' },
  'action-odpoczynek': { src: actionOdpoczynek, alt: 'Odpoczynek' },
  'action-oddech': { src: actionOddech, alt: 'Spokojny oddech' },
  'action-jedzenie': { src: actionJedzenie, alt: 'Jedzenie' },

  'color-auto': { src: colorAuto, alt: 'Czerwone auto' },
  'color-balon': { src: colorBalon, alt: 'Niebieski balon' },
  'color-cytryna': { src: colorCytryna, alt: 'Żółta cytryna' },
  'color-kostka': { src: colorKostka, alt: 'Zielona kostka', isPlaceholder: true },
  'color-kokardka': { src: colorKokardka, alt: 'Różowa kokardka', isPlaceholder: true },

  'shape-kolo': { src: shapeKolo, alt: 'Koło' },
  'shape-kwadrat': { src: shapeKwadrat, alt: 'Kwadrat' },
  'shape-trojkat': { src: shapeTrojkat, alt: 'Trójkąt' },
  'shape-serce': { src: shapeSerce, alt: 'Serce', isPlaceholder: true },
  'object-roof': { src: objectRoof, alt: 'Dach', isPlaceholder: true }
}

export function getAsset(id: AssetId): AssetEntry {
  return ROZA_ASSETS[id]
}
