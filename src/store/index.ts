import { createStore } from 'redux-dynamic-modules-core'
import { getSagaExtension } from 'redux-dynamic-modules-saga'
import { history } from './history'
import { getRouterModule } from './modules/routerModule'

export const store = createStore(
  {
    initialState: {},
    extensions: [getSagaExtension()],
  },
  getRouterModule(history),
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export { history }
