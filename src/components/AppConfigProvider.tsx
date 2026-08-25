import { ConfigProvider, theme } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import type { ReactNode } from 'react'

type AppConfigProviderProps = {
  children: ReactNode
}

/** Глобальная тема Ant Design + русская локализация (таблицы, пагинация, формы). */
export function AppConfigProvider({ children }: AppConfigProviderProps) {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
