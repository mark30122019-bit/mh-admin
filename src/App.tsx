import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import { AppConfigProvider } from '@/components/AppConfigProvider'
import { AppRoutes } from '@/routes'
import { history, store } from '@/store'

export default function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppConfigProvider>
          <AppRoutes />
        </AppConfigProvider>
      </ConnectedRouter>
    </Provider>
  )
}
