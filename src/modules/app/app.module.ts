import type { IModule } from 'redux-dynamic-modules-core'
import { appReducer } from './reducer'

export interface AppModuleState {
  app: ReturnType<typeof appReducer>
}

/** Глобальный модуль приложения (язык и пр.) — регистрируется в корневом store. */
export function getAppModule(): IModule<AppModuleState> {
  return {
    id: 'app',
    reducerMap: {
      app: appReducer,
    },
  }
}
