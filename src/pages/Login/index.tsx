import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { getAuthModule } from '@/modules/auth/auth.module'

/** Страница авторизации. TODO: форма логина, обработка ошибок API. */
export default function LoginPage() {
  return (
    <DynamicModuleLoader modules={[getAuthModule()]} strictMode>
      <div className="flex min-h-screen items-center justify-center">
        {/* login form */}
      </div>
    </DynamicModuleLoader>
  )
}
