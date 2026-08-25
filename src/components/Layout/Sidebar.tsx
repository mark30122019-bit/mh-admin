import {
  FileTextOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'

const { Sider } = Layout

const MENU_ITEMS: MenuProps['items'] = [
  {
    key: '/posts',
    icon: <FileTextOutlined />,
    label: 'Посты',
  },
  {
    key: '/authors',
    icon: <TeamOutlined />,
    label: 'Авторы',
  },
  {
    key: '/tags',
    icon: <TagsOutlined />,
    label: 'Теги',
  },
]

/** Layout.Sider + Menu — навигация по разделам ТЗ. */
export function Sidebar() {
  const history = useHistory()
  const location = useLocation()

  const selectedKey =
    MENU_ITEMS?.find((item) =>
      item && 'key' in item && typeof item.key === 'string'
        ? location.pathname.startsWith(item.key)
        : false,
    )?.key?.toString() ?? location.pathname

  return (
    <Sider breakpoint="lg" collapsedWidth={64} width={220}>
      <div
        style={{
          height: 64,
          margin: 16,
          color: '#fff',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Machineheads
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={MENU_ITEMS}
        onClick={({ key }) => history.push(key)}
      />
    </Sider>
  )
}
