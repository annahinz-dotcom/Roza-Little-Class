import type { ReactNode } from 'react'
import faceRadosna from '../assets/face_radosna.png'
import faceSmutna from '../assets/face_smutna.png'
import faceZmeczona from '../assets/face_zmeczona.png'
import faceZla from '../assets/face_zla.png'
import faceGlodna from '../assets/face_glodna.png'

// Original illustrated facial-expression icons matching the app's warm
// watercolor/colored-pencil style — replaces the earlier hand-drawn line-art
// placeholder set.

const SOURCES: Record<string, string> = {
  radosna: faceRadosna,
  smutna: faceSmutna,
  zmeczona: faceZmeczona,
  zla: faceZla,
  glodna: faceGlodna
}

const LABELS: Record<string, string> = {
  radosna: 'Radosna',
  smutna: 'Smutna',
  zmeczona: 'Zmęczona',
  zla: 'Zła',
  glodna: 'Głodna'
}

function FaceImg({ id }: { id: string }) {
  return <img src={SOURCES[id]} alt={LABELS[id]} className="h-full w-full object-contain" />
}

export function FaceRadosna() {
  return <FaceImg id="radosna" />
}
export function FaceSmutna() {
  return <FaceImg id="smutna" />
}
export function FaceZmeczona() {
  return <FaceImg id="zmeczona" />
}
export function FaceZla() {
  return <FaceImg id="zla" />
}
export function FaceGlodna() {
  return <FaceImg id="glodna" />
}

export const FACE_ICONS: Record<string, () => ReactNode> = {
  radosna: FaceRadosna,
  smutna: FaceSmutna,
  zmeczona: FaceZmeczona,
  zla: FaceZla,
  glodna: FaceGlodna
}
