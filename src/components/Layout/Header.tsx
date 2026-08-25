import { Layout, Space, Typography } from 'antd'
import type { ReactNode } from 'react'

const { Header } = Layout

type AppHeaderProps = {
  title?: string
  profileSlot?: ReactNode
}

/** Layout.Header — заголовок раздела и слот профиля администратора. */
export function AppHeader({
  title = 'Админ-панель',
  profileSlot,
}: AppHeaderProps) {
  return (
    <Header
      style={{
        background: '#fff',
        paddingInline: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      <Space>{profileSlot ?? <Typography.Text>Администратор</Typography.Text>}</Space>
    </Header>
  )
}
