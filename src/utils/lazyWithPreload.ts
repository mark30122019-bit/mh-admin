import { createElement, lazy, type ComponentType } from 'react'

type AnyPage = ComponentType<object>

type ModuleDefault = { default: AnyPage }

export type PreloadablePage = ((props: object) => React.ReactNode) & {
  preload: () => Promise<ModuleDefault>
  isReady: () => boolean
}

/**
 * React.lazy + синхронный кэш после preload.
 * Иначе даже «готовый» dynamic import() даёт Promise → 1 кадр Suspense.
 */
export function lazyWithPreload(
  factory: () => Promise<{ default: AnyPage }>,
): PreloadablePage {
  let module: ModuleDefault | null = null
  let promise: Promise<ModuleDefault> | null = null

  const load = (): Promise<ModuleDefault> => {
    if (!promise) {
      promise = factory().then((resolved) => {
        module = resolved
        return resolved
      })
    }
    return promise
  }

  const Lazy = lazy(load)

  function PreloadedOrLazy(props: object) {
    if (module) {
      return createElement(module.default, props)
    }
    return createElement(Lazy, props)
  }

  const Component = PreloadedOrLazy as PreloadablePage
  Component.preload = load
  Component.isReady = () => module != null
  return Component
}
