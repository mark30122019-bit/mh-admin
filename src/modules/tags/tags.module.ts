import type { ISagaModule } from 'redux-dynamic-modules-saga'
import { tagsActions } from './actions'
import { tagsReducer } from './reducer'
import { tagsSaga } from './sagas'

export interface TagsModuleState {
  tags: ReturnType<typeof tagsReducer>
}

export function getTagsModule(): ISagaModule<TagsModuleState> {
  return {
    id: 'tags',
    reducerMap: {
      tags: tagsReducer,
    },
    sagas: [tagsSaga],
    initialActions: [tagsActions.fetchRequest()],
  }
}
