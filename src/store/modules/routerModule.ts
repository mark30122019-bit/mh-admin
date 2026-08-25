import { connectRouter, routerMiddleware } from 'connected-react-router'
import type { IModule } from 'redux-dynamic-modules-core'
import type { History } from 'history'
import type { RouterState } from 'connected-react-router'

export interface RouterModuleState {
  router: RouterState
}

export function getRouterModule(history: History): IModule<RouterModuleState> {
  return {
    id: 'router',
    reducerMap: {
      router: connectRouter(history),
    },
    middlewares: [routerMiddleware(history)],
  }
}
