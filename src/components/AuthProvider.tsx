import { Spin } from '@/components/ui'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { getAuthModule } from '@/modules/auth/auth.module'
import { selectIsAuthInitialized } from '@/modules/auth/selectors'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'

type AuthGateProps = {
  children: ReactNode
}

function AuthGate({ children }: AuthGateProps) {
  const isInitialized = useSelector(selectIsAuthInitialized)

  if (!isInitialized) {
    return <Spin fullPage />
  }

  return <>{children}</>
}

export function AuthProvider({ children }: AuthGateProps) {
  return (
    <DynamicModuleLoader modules={[getAuthModule()]} strictMode>
      <AuthGate>{children}</AuthGate>
    </DynamicModuleLoader>
  )
}
