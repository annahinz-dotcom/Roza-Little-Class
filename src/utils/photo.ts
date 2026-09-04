/**
 * Processes a photo entirely on-device before it ever reaches the network:
 * corrects iPhone orientation, resizes, and re-encodes as JPEG. Re-encoding
 * via canvas naturally drops the original EXIF block (including GPS
 * location), which is what satisfies the "strip location metadata"
 * requirement — there's nothing left to strip because it's never carried
 * into the new file.
 */
async function resizeToBlob(file: File, maxDimension: number, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process image'))),
      'image/jpeg',
      quality
    )
  })
}

export interface ProcessedPhoto {
  displayBlob: Blob
  thumbnailBlob: Blob
}

export async function processPhoto(file: File): Promise<ProcessedPhoto> {
  if (!file.type.startsWith('image/')) {
    throw new Error('unsupported-format')
  }
  const [displayBlob, thumbnailBlob] = await Promise.all([
    resizeToBlob(file, 1600, 0.82),
    resizeToBlob(file, 320, 0.75)
  ])
  return { displayBlob, thumbnailBlob }
}
