import { Suspense, type ComponentType, type ReactNode } from 'react'
import { Spin } from '@/components/ui'

type LazyPageProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function LazyPage({ children, fallback }: LazyPageProps) {
  return (
    <Suspense fallback={fallback ?? <Spin fullPage />}>
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
