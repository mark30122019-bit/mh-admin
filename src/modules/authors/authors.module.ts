import type { ISagaModule } from 'redux-dynamic-modules-saga'
import { authorsReducer } from './reducer'
import { authorsSaga } from './sagas'

export interface AuthorsModuleState {
  authors: ReturnType<typeof authorsReducer>
}

export function getAuthorsModule(): ISagaModule<AuthorsModuleState> {
  return {
    id: 'authors',
    reducerMap: {
      authors: authorsReducer,
    },
    sagas: [authorsSaga],
  }
}
