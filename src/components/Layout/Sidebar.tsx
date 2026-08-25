import { FileTextOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'

const { Sider } = Layout

const MENU_ITEMS: MenuProps['items'] = [
  {
    key: '/posts',
    icon: <FileTextOutlined />,
    label: 'Posts Management',
  },
  // TODO: добавить Authors / Tags после вёрстки страниц
  // { key: '/authors', icon: <TeamOutlined />, label: 'Authors' },
  // { key: '/tags', icon: <TagsOutlined />, label: 'Tags' },
]

/** Layout.Sider + Menu — навигация по разделам админки. */
export function Sidebar() {
  const history = useHistory()
  const location = useLocation()

  const selectedKey =
    MENU_ITEMS?.find((item) =>
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
        items={MENU_ITEMS}
        onClick={({ key }) => history.push(key)}
        style={{ padding: '8px 12px', background: 'transparent' }}
      />
    </Sider>
  )
}
