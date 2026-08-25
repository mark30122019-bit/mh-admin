import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { AppConfigProvider } from '@/components/AppConfigProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { AppRoutes } from '@/routes'
import { history, store } from '@/store'

export default function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppConfigProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AppConfigProvider>
      </ConnectedRouter>
    </Provider>
  )
}
