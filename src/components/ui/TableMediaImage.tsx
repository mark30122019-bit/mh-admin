import { Image, Skeleton } from 'antd'
import type { ImageProps } from 'antd'
import { useEffect, useState } from 'react'

type TableMediaImageProps = {
  src: string
  alt?: string
  width: number
  height: number
  /** rect — превью поста; circle — аватар автора. */
  shape?: 'rect' | 'circle'
  preview?: ImageProps['preview']
}

/**
 * Картинка в ячейке таблицы: пока грузится — скелетон тех же размеров/формы.
 * Учитывает кэш браузера (complete), чтобы не залипать на скелетоне.
 */
export function TableMediaImage({
  src,
  alt,
  width,
  height,
  shape = 'rect',
  preview,
}: TableMediaImageProps) {
  const [loaded, setLoaded] = useState(false)
  const borderRadius = shape === 'circle' ? '50%' : 4

  useEffect(() => {
    let cancelled = false
    setLoaded(false)

    const probe = new window.Image()
    const markLoaded = () => {
      if (!cancelled) setLoaded(true)
    }

    probe.onload = markLoaded
    probe.onerror = markLoaded
    probe.src = src

    if (probe.complete) {
      markLoaded()
    }

    return () => {
      cancelled = true
      probe.onload = null
      probe.onerror = null
    }
  }, [src])

  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden"
      style={{ width, height, borderRadius }}
    >
      {!loaded ? (
        <Skeleton.Node
          active
          style={{
            position: 'absolute',
            inset: 0,
            width,
            height,
            borderRadius,
          }}
        >
          <span />
        </Skeleton.Node>
      ) : null}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          objectFit: 'cover',
          borderRadius,
          display: 'block',
          background: '#f5f5f5',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
        preview={preview}
      />
    </span>
  )
}
