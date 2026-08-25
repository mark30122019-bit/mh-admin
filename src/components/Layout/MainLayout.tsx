import { Avatar, Layout } from 'antd'
import type { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '@/components/ui'
import { AppHeader } from './Header'
import { Sidebar } from './Sidebar'

const { Content } = Layout

type MainLayoutProps = {
  children: ReactNode
}

/**
 * Каркас админ-панели:
 * Layout.Sider + Layout.Header (профиль / logout) + Layout.Content.
 */
export function MainLayout({ children }: MainLayoutProps) {
  const history = useHistory()

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
                SC
              </Avatar>
              <span style={{ fontWeight: 500, color: '#262626' }}>Sarah Chen</span>
            </>
          }
          actionsSlot={
            <Button onClick={() => history.push('/login')}>Logout</Button>
          }
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
