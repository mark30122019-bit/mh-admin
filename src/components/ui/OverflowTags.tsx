import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Tooltip } from 'antd'
import { EllipsisTooltip } from './EllipsisTooltip'
import { Tag } from './Tag'

export type OverflowTagItem = {
  key: string
  label: string
}

type OverflowTagsProps = {
  tags: OverflowTagItem[]
  /** Зазор между чипами (px). */
  gap?: number
}

/**
 * Ряд тегов в одну строку. Если не влезают — «…» с тёмным tooltip
 * со всеми названиями (как у длинного текста в таблице).
 */
export function OverflowTags({ tags, gap = 4 }: OverflowTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(tags.length)

  const tagsSignature = useMemo(
    () => tags.map((tag) => `${tag.key}:${tag.label}`).join('|'),
    [tags],
  )

  const allLabels = useMemo(
    () => tags.map((tag) => tag.label).join(', '),
    [tags],
  )

  const recompute = useCallback(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure || tags.length === 0) {
      setVisibleCount((prev) => (prev === tags.length ? prev : tags.length))
      return
    }

    const available = container.clientWidth
    if (available <= 0) return

    const ellipsisEl = measure.querySelector(
      '[data-overflow-ellipsis]',
    ) as HTMLElement | null
    const ellipsisWidth = ellipsisEl?.offsetWidth ?? 28

    const tagEls = Array.from(
      measure.querySelectorAll<HTMLElement>('[data-overflow-tag]'),
    )

    let used = 0
    let count = tags.length

    for (let i = 0; i < tagEls.length; i += 1) {
      const width = tagEls[i].offsetWidth
      const withGap = used + (i > 0 ? gap : 0) + width
      const hasMore = i < tags.length - 1
      const limit = hasMore ? available - gap - ellipsisWidth : available

      if (withGap > limit) {
        count = i
        break
      }
      used = withGap
    }

    setVisibleCount((prev) => (prev === count ? prev : count))
  }, [gap, tags.length, tagsSignature])

  useLayoutEffect(() => {
    recompute()
  }, [recompute])

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver(() => {
      recompute()
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [recompute])

  if (tags.length === 0) return null

  const visible = tags.slice(0, Math.max(0, visibleCount))
  const hasOverflow = visibleCount < tags.length

  return (
    <div ref={containerRef} className="relative w-full min-w-0 overflow-hidden">
      {/* Оффскрин-линейка: не перекрывает клики и не влияет на layout ячейки */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute flex whitespace-nowrap"
        style={{
          gap,
          left: -10000,
          top: 0,
          visibility: 'hidden',
        }}
      >
        {tags.map((tag) => (
          <span key={tag.key} data-overflow-tag className="inline-flex">
            <Tag
              style={{ maxWidth: 96, marginInlineEnd: 0 }}
              className="!m-0 truncate"
            >
              {tag.label}
            </Tag>
          </span>
        ))}
        <span data-overflow-ellipsis className="inline-flex">
          <Tag style={{ marginInlineEnd: 0 }} className="!m-0">
            …
          </Tag>
        </span>
      </div>

      <div
        className="flex max-w-full min-w-0 items-center overflow-hidden"
        style={{ gap }}
      >
        {visible.map((tag) => (
          <EllipsisTooltip key={tag.key} title={tag.label}>
            <Tag
              style={{ maxWidth: 96, marginInlineEnd: 0 }}
              className="!m-0 truncate"
            >
              {tag.label}
            </Tag>
          </EllipsisTooltip>
        ))}
        {hasOverflow ? (
          <Tooltip placement="topLeft" title={allLabels}>
            {/* span обязателен: Tooltip нужен DOM-узел с ref (Tag-обёртка ref не пробрасывает) */}
            <span className="inline-flex shrink-0 cursor-default leading-none">
              <Tag style={{ marginInlineEnd: 0 }} className="!m-0">
                …
              </Tag>
            </span>
          </Tooltip>
        ) : null}
      </div>
    </div>
  )
}
