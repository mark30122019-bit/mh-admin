import type { ReactNode } from 'react'
import {
  DynamicModuleLoader as BaseDynamicModuleLoader,
  type IDynamicModuleLoaderProps,
} from 'redux-dynamic-modules-react'

type Props = IDynamicModuleLoaderProps & {
  children?: ReactNode
}

/** Thin wrapper: package typings omit `children` (pre-React 18). */
export function DynamicModuleLoader({ children, ...props }: Props) {
  return (
    <BaseDynamicModuleLoader {...props}>{children}</BaseDynamicModuleLoader>
  )
}
