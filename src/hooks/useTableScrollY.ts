import { useLayoutEffect, useState, type RefObject } from 'react'

type UseTableScrollYOptions = {
  /** Число строк на экране (включая placeholder). */
  contentRows: number
  /** Оценка высоты одной строки тела таблицы. */
  rowHeight: number
  /** Fallback высоты thead, пока таблица не смонтирована. */
  headerRowHeight?: number
  minHeight?: number
  /** Пересчёт при смене ключа (например loading → false). */
  observeKey?: unknown
}

export type TableScrollYState =
  | { ready: false }
  | {
      ready: true
      /**
       * Высота тела для Ant Design scroll.y.
       * undefined — контент влазит, скролл не нужен (без пустого низа).
       */
      y: number | undefined
    }

/**
 * Скролл тела таблицы только если строки не влазят в доступную высоту.
 * Иначе y не задаём — таблица по высоте контента, без лишней пустоты.
 */
export function useTableScrollY(
  containerRef: RefObject<HTMLElement | null>,
  {
    contentRows,
    rowHeight,
    headerRowHeight = 47,
    minHeight = 120,
    observeKey,
  }: UseTableScrollYOptions,
): TableScrollYState {
  const [state, setState] = useState<TableScrollYState>({ ready: false })

  useLayoutEffect(() => {
    const node = containerRef.current
    if (!node || typeof ResizeObserver === 'undefined') return

    const readHeaderHeight = () => {
      const header = node.querySelector(
        '.ant-table-header, .ant-table-thead',
      ) as HTMLElement | null
      if (header && header.offsetHeight > 0) return header.offsetHeight
      return headerRowHeight
    }

    const update = () => {
      const headerH = readHeaderHeight()
      // 1px — нижняя граница контейнера Ant Table, чтобы последний ряд не клипался
  const availableBody = Math.max(
        minHeight,
        Math.floor(node.clientHeight - headerH),
      )
      const contentBody = Math.max(0, contentRows) * rowHeight

      if (contentBody > availableBody) {
        // +1 компенсирует border-collapse / subpixel, чтобы последний ряд не клипался
        setState({ ready: true, y: availableBody + 1 })
      } else {
        setState({ ready: true, y: undefined })
      }
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [
    containerRef,
    contentRows,
    rowHeight,
    headerRowHeight,
    minHeight,
    observeKey,
  ])

  return state
}
