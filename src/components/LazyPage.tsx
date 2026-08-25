import { Suspense, type ComponentType, type ReactNode } from 'react'
import { Spin } from 'antd'

type LazyPageProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function LazyPage({ children, fallback }: LazyPageProps) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div className="flex min-h-screen items-center justify-center">
            <Spin size="large" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  )
}

export function withLazyPage<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function LazyWrapped(props: P) {
    return (
      <LazyPage fallback={fallback}>
        <Component {...props} />
      </LazyPage>
    )
  }
}
