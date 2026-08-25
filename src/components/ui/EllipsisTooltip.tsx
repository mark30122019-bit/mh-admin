import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Tooltip } from 'antd'
import type { TooltipProps } from 'antd'

type EllipsisTooltipProps = {
  title?: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
  placement?: TooltipProps['placement']
}

function isOverflowing(el: HTMLElement): boolean {
  return el.scrollWidth > el.clientWidth + 1
}

/** Tooltip только если текст реально обрезан (ellipsis). */
export function EllipsisTooltip({
  title,
  children,
  className,
  style,
  placement = 'topLeft',
}: EllipsisTooltipProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = useState(false)

  const updateOverflow = useCallback(() => {
    const el = ref.current
    if (!el) {
      setTruncated(false)
      return
    }

    const child = el.firstElementChild as HTMLElement | null
    const target =
      child?.classList.contains('ant-tag') ? child : el

    setTruncated(isOverflowing(target))
  }, [])

  useLayoutEffect(() => {
    updateOverflow()
  })

  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const ro = new ResizeObserver(() => updateOverflow())
    ro.observe(el)
    if (el.firstElementChild instanceof HTMLElement) {
      ro.observe(el.firstElementChild)
    }
    return () => ro.disconnect()
  }, [updateOverflow, title, children])

  if (title == null || title === '') {
    return (
      <span ref={ref} className={className} style={style}>
        {children}
      </span>
    )
  }

  return (
    <Tooltip placement={placement} title={truncated ? title : undefined}>
      <span
        ref={ref}
        className={className}
        style={style}
        onMouseEnter={updateOverflow}
      >
        {children}
      </span>
    </Tooltip>
  )
}
