import type { ReactNode, Ref } from 'react'

type AdminTableShellProps = {
  children: ReactNode
  className?: string
  /** Ref на внешний flex-измеритель (доступная высота). */
  containerRef?: Ref<HTMLDivElement>
}

/**
 * Внешний flex-1 слот для измерения высоты + inset-рамка по контенту
 * (max-height: 100%, без растягивания пустого низа).
 */
export function AdminTableShell({
  children,
  className = '',
  containerRef,
}: AdminTableShellProps) {
  return (
    <div
      ref={containerRef}
      className={['min-h-0 flex-1 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="admin-table-shell max-h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  )
}
