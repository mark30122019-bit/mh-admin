import { useLayoutEffect, useState, type RefObject } from 'react'

type UseTableScrollYOptions = {
  /** Fallback высоты thead, пока таблица не смонтирована. */
  headerRowHeight?: number
  minHeight?: number
  /** Пересчёт при смене ключа (например loading → false). */
  observeKey?: unknown
}

export type TableScrollYState =
  | { ready: false }
  | { ready: true; y: number }

/**
 * Высота тела таблицы = доступная высота AdminTableShell минус thead.
 * Всегда заполняет область (scroll.y), чтобы отступы/высота карточки были стабильны.
 */
export function useTableScrollY(
  containerRef: RefObject<HTMLElement | null>,
  {
    headerRowHeight = 47,
    minHeight = 120,
    observeKey,
  }: UseTableScrollYOptions = {},
): TableScrollYState {
  const [state, setState] = useState<TableScrollYState>({ ready: false })

  useLayoutEffect(() => {
    const node = containerRef.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const readHeaderHeight = () => {
      const header = node.querySelector(
        '.ant-table-header',
      ) as HTMLElement | null
      if (header && header.getBoundingClientRect().height > 0) {
        return Math.ceil(header.getBoundingClientRect().height)
      }
      const thead = node.querySelector('.ant-table-thead') as HTMLElement | null
      if (thead && thead.getBoundingClientRect().height > 0) {
        return Math.ceil(thead.getBoundingClientRect().height)
      }
      return headerRowHeight
    }

    const update = () => {
      // Только чистая высота тела: shell − шапка (без flex-раздувания body)
      const available = Math.max(
        minHeight,
        Math.floor(node.clientHeight - readHeaderHeight()),
      )
      setState({ ready: true, y: available })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [containerRef, headerRowHeight, minHeight, observeKey])

  return state
}
