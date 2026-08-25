import type { ReactNode, Ref } from 'react'

type AdminTableShellProps = {
  children: ReactNode
  className?: string
  /** Ref на оболочку — для useTableScrollY (доступная высота). */
  containerRef?: Ref<HTMLDivElement>
}

/**
 * Flex-1 слот на всю высоту карточки + inset-рамка таблицы.
 */
export function AdminTableShell({
  children,
  className = '',
  containerRef,
}: AdminTableShellProps) {
  return (
    <div
      ref={containerRef}
      className={[
        'admin-table-shell flex min-h-0 w-full flex-1 flex-col overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
