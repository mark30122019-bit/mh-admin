import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSessionExpiredHandler } from '@/api'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { authActions } from '@/modules/auth/actions'
import { getAuthModule } from '@/modules/auth/auth.module'
import { selectIsAuthInitialized } from '@/modules/auth/selectors'

type AuthGateProps = {
  children: ReactNode
}

function AuthGate({ children }: AuthGateProps) {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectIsAuthInitialized)

  useEffect(() => {
    setSessionExpiredHandler(() => {
      dispatch(authActions.sessionExpired())
    })

    return () => {
      setSessionExpiredHandler(null)
    }
  }, [dispatch])

  // Без Spin: короткая пауза на restore session, дальше сразу страница/скелетон списка.
  if (!isInitialized) {
    return <div className="min-h-screen bg-[#f5f5f5]" />
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
