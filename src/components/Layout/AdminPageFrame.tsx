import type { ReactNode } from 'react'

type AdminPageFrameProps = {
  children: ReactNode
  /** Доп. классы для белой карточки. */
  className?: string
  /**
   * Заполнить высоту Content под хедером (flex-колонка).
   * Нужно для таблиц со scroll.y без лишнего скролла страницы.
   */
  fill?: boolean
}

/**
 * Контент админки: центрируется, max-width на 2K/4K,
 * адаптивные внутренние отступы (tablet → desktop → wide).
 */
export function AdminPageFrame({
  children,
  className = '',
  fill = false,
}: AdminPageFrameProps) {
  return (
    <div
      className={
        fill
          ? 'mx-auto flex min-h-0 w-full max-w-screen-2xl flex-1 flex-col'
          : 'mx-auto w-full max-w-screen-2xl'
      }
    >
      <div
        className={[
          'rounded-lg bg-white p-4 sm:p-5 md:p-6 lg:p-8',
          fill ? 'flex min-h-0 flex-1 flex-col' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
