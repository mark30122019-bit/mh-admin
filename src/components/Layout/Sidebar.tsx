import { FileTextOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'

const { Sider } = Layout

const PREFETCH_BY_PATH: Record<string, () => Promise<unknown>> = {
  '/posts': () => import('@/pages/Posts'),
  '/authors': () => import('@/pages/Authors'),
  '/tags': () => import('@/pages/Tags'),
}

function prefetch(path: string) {
  const loader = PREFETCH_BY_PATH[path]
  if (loader) void loader()
}

export function Sidebar() {
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation()

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/posts',
        icon: <FileTextOutlined />,
        label: (
          <span onMouseEnter={() => prefetch('/posts')}>{t('nav.posts')}</span>
        ),
      },
      {
        key: '/authors',
        icon: <TeamOutlined />,
        label: (
          <span onMouseEnter={() => prefetch('/authors')}>
            {t('nav.authors')}
          </span>
        ),
      },
      {
        key: '/tags',
        icon: <TagsOutlined />,
        label: (
          <span onMouseEnter={() => prefetch('/tags')}>{t('nav.tags')}</span>
        ),
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
      style={{
        background: '#001529',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'auto',
        flexShrink: 0,
      }}
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
