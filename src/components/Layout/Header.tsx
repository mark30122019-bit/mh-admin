import { Layout, Space } from 'antd'
import type { ReactNode } from 'react'

const { Header } = Layout

type AppHeaderProps = {
  profileSlot?: ReactNode
  actionsSlot?: ReactNode
}

/** Layout.Header — профиль администратора слева, действия справа. */
export function AppHeader({ profileSlot, actionsSlot }: AppHeaderProps) {
  return (
    <Header
      className="admin-app-header"
      style={{
        background: '#fff',
        paddingInline: 32,
        height: 64,
        lineHeight: '64px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 20,
        width: '100%',
      }}
    >
      <Space size={12} align="center">
        {profileSlot}
      </Space>
      <Space>{actionsSlot}</Space>
    </Header>
  )
}
