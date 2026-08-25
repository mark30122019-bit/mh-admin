import type { ISagaModule } from 'redux-dynamic-modules-saga'
import { postsReducer } from './reducer'
import { postsSaga } from './sagas'

export interface PostsModuleState {
  posts: ReturnType<typeof postsReducer>
}

export function getPostsModule(): ISagaModule<PostsModuleState> {
  return {
    id: 'posts',
    reducerMap: {
      posts: postsReducer,
    },
    sagas: [postsSaga],
  }
}
