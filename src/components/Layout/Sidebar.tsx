import { FileTextOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

const { Sider } = Layout

export function Sidebar() {
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation()

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/posts',
        icon: <FileTextOutlined />,
        label: t('nav.posts'),
      },
      {
        key: '/authors',
        icon: <TeamOutlined />,
        label: t('nav.authors'),
      },
      {
        key: '/tags',
        icon: <TagsOutlined />,
        label: t('nav.tags'),
      },
    ],
    [t],
  )

  const selectedKey =
    menuItems?.find((item) =>
      item && 'key' in item && typeof item.key === 'string'
        ? location.pathname.startsWith(item.key)
        : false,
    )?.key?.toString() ?? '/posts'

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth={64}
      width={240}
      style={{ background: '#001529' }}
    >
      <div
        style={{
          height: 64,
          padding: '0 24px',
          color: '#fff',
          fontWeight: 600,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        machineheads
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => history.push(key)}
        style={{ padding: '8px 12px', background: 'transparent' }}
      />
    </Sider>
  )
}
