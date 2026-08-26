import { FileTextOutlined, TagsOutlined, TeamOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from '@/hooks/useTranslation'
import { warmAdminSection } from '@/utils/prefetchAdminPage'

const { Sider } = Layout

/** Ниже xl (1200px) — только иконки, больше места под таблицы. */
const COLLAPSE_MQ = '(max-width: 1199px)'

export function Sidebar() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(COLLAPSE_MQ).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(COLLAPSE_MQ)
    const sync = () => setCollapsed(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const menuItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/posts',
        icon: <FileTextOutlined />,
        label: t('nav.posts'),
        onMouseEnter: () => warmAdminSection('/posts', dispatch),
      },
      {
        key: '/authors',
        icon: <TeamOutlined />,
        label: t('nav.authors'),
        onMouseEnter: () => warmAdminSection('/authors', dispatch),
      },
      {
        key: '/tags',
        icon: <TagsOutlined />,
        label: t('nav.tags'),
        onMouseEnter: () => warmAdminSection('/tags', dispatch),
      },
    ],
    [dispatch, t],
  )

  const selectedKey =
    menuItems?.find((item) =>
      item && 'key' in item && typeof item.key === 'string'
        ? location.pathname.startsWith(item.key)
        : false,
    )?.key?.toString() ?? '/posts'

  return (
    <Sider
      collapsed={collapsed}
      collapsedWidth={64}
      width={220}
      trigger={null}
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
        className={
          collapsed
            ? 'flex h-16 items-center justify-center text-[15px] font-semibold tracking-tight text-white'
            : 'flex h-16 items-center px-5 text-base font-semibold tracking-tight text-white'
        }
      >
        {collapsed ? 'mh' : 'machineheads'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => {
          warmAdminSection(key, dispatch)
          history.push(key)
        }}
        style={{
          padding: collapsed ? '8px 0' : '8px 12px',
          background: 'transparent',
        }}
      />
    </Sider>
  )
}
