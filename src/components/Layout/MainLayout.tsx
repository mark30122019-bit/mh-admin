import { Avatar, Layout } from 'antd'
import type { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui'
import { authActions } from '@/modules/auth/actions'
import type { AuthModuleState } from '@/modules/auth/auth.module'
import {
  selectAuthDisplayName,
  selectAuthInitials,
} from '@/modules/auth/selectors'
import { AppHeader } from './Header'
import { Sidebar } from './Sidebar'

const { Content } = Layout

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const dispatch = useDispatch()
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
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
              <span style={{ fontWeight: 500, color: '#262626' }}>{displayName}</span>
            </>
          }
          actionsSlot={<Button onClick={handleLogout}>Logout</Button>}
        />
        <Content
          style={{
            padding: '32px 40px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
