import type { Area } from 'react-easy-crop'

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.crossOrigin = 'anonymous'
    image.src = url
  })
}

/** Вырезает область кропа в JPEG/PNG File. */
export async function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
  mimeType = 'image/jpeg',
): Promise<File> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable')
  }

  const width = Math.max(1, Math.round(pixelCrop.width))
  const height = Math.max(1, Math.round(pixelCrop.height))
  canvas.width = width
  canvas.height = height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height,
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error('Failed to crop image'))
          return
        }
        resolve(result)
      },
      mimeType,
      0.92,
    )
  })

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'image'
  const extension = mimeType === 'image/png' ? 'png' : 'jpg'
  return new File([blob], `${baseName}-cropped.${extension}`, { type: mimeType })
}
