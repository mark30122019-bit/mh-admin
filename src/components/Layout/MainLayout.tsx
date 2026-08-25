import { Layout } from 'antd'
import type { ReactNode } from 'react'
import { AppHeader } from './Header'
import { Sidebar } from './Sidebar'

const { Content } = Layout

type MainLayoutProps = {
  children: ReactNode
  title?: string
}

/**
 * Каркас админ-панели:
 * Layout.Sider (меню) + Layout.Header (заголовок/профиль) + Layout.Content (страницы).
 */
export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <AppHeader title={title} />
        <Content style={{ margin: 16, padding: 16, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
