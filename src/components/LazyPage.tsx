import { Suspense, type ComponentType, type ReactNode } from 'react'
import { PageContentSkeleton } from '@/components/ui'

type LazyPageProps = {
  children: ReactNode
  fallback?: ReactNode
}

/** Suspense-обёртка для React.lazy. Fallback по умолчанию — скелетон, не Spin. */
export function LazyPage({ children, fallback }: LazyPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 flex-col">
          {fallback ?? <PageContentSkeleton />}
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
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
