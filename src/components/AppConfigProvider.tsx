import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/es/locale/en_US'
import ruRU from 'antd/es/locale/ru_RU'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectAppLanguage } from '@/modules/app/selectors'
import type { AppModuleRootState } from '@/modules/app/selectors'

type AppConfigProviderProps = {
  children: ReactNode
}

/**
 * Глобальная тема Ant Design + локаль из Redux (`app.language`),
 * чтобы системные тексты (пагинация, пустые таблицы) следовали языку UI.
 */
export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const language = useSelector((state: AppModuleRootState) =>
    selectAppLanguage(state),
  )

  return (
    <ConfigProvider
      locale={language === 'ru' ? ruRU : enUS}
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
