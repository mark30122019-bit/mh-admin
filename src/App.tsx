import { ConfigProvider } from 'antd'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { AppRoutes } from '@/routes'
import { history, store } from '@/store'

export default function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ConfigProvider>
          <AppRoutes />
        </ConfigProvider>
      </ConnectedRouter>
    </Provider>
  )
}
