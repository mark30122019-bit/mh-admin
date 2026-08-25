import type { ReactNode } from 'react'

type MainLayoutProps = {
  children: ReactNode
}

/** Основной каркас админ-панели. TODO: подключить Sidebar и навигацию. */
export function MainLayout({ children }: MainLayoutProps) {
  return <div className="min-h-screen">{children}</div>
}
