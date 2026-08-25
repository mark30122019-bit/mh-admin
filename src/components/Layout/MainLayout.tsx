import { Avatar, Layout } from 'antd'
import type { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui'
import { useTranslation } from '@/hooks/useTranslation'
import { authActions } from '@/modules/auth/actions'
import type { AuthModuleState } from '@/modules/auth/auth.module'
import {
  selectAuthDisplayName,
  selectAuthInitials,
} from '@/modules/auth/selectors'
import { AppHeader } from './Header'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Sidebar } from './Sidebar'

const { Content } = Layout

type MainLayoutProps = {
  children: ReactNode
}

/**
 * Enterprise layout: Sider + Header зафиксированы, скроллится только Content.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const displayName = useSelector((state: AuthModuleState) =>
    selectAuthDisplayName(state),
  )
  const initials = useSelector((state: AuthModuleState) =>
    selectAuthInitials(state),
  )

  const handleLogout = () => {
    dispatch(authActions.logout())
  }

  return (
    <Layout hasSider style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Layout
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppHeader
          profileSlot={
            <>
              <Avatar
                size={36}
                style={{
                  backgroundColor: '#e6f4ff',
                  color: '#1677ff',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {initials}
              </Avatar>
              <span style={{ fontWeight: 500, color: '#262626' }}>
                {displayName}
              </span>
            </>
          }
          actionsSlot={
            <>
              <LanguageSwitcher />
              <Button onClick={handleLogout}>{t('common.logout')}</Button>
            </>
          }
        />
        <Content className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f5f5] px-3 py-3 sm:px-3 sm:py-3 md:px-4 md:py-4 xl:px-8 xl:py-6 2xl:px-10 2xl:py-8">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
