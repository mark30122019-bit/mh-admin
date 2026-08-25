import type { ISagaModule } from 'redux-dynamic-modules-saga'
import { AUTH_INIT } from './actions'
import { authReducer } from './reducer'
import { authSaga } from './sagas'

export interface AuthModuleState {
  auth: ReturnType<typeof authReducer>
}

export function getAuthModule(): ISagaModule<AuthModuleState> {
  return {
    id: 'auth',
    reducerMap: {
      auth: authReducer,
    },
    sagas: [authSaga],
    initialActions: [{ type: AUTH_INIT }],
  }
}
