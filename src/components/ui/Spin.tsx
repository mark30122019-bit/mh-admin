import { Spin as AntSpin } from 'antd'
import type { SpinProps } from 'antd'
import type { ReactNode } from 'react'

export type { SpinProps }

type AppSpinProps = SpinProps & {
  /** Центрировать спиннер на всю доступную высоту (lazy load / ожидание API). */
  fullPage?: boolean
  children?: ReactNode
}

/** Индикатор загрузки (lazy pages и ожидание ответов API). */
export function Spin({ fullPage, style, children, ...props }: AppSpinProps) {
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <AntSpin size="large" {...props}>
          {children}
        </AntSpin>
      </div>
    )
  }

  return (
    <AntSpin style={style} {...props}>
      {children}
    </AntSpin>
  )
}
