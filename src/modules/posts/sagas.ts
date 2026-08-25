import axios from 'axios'
import type { SagaIterator } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchPostsList } from '@/api/posts'
import {
  POSTS_FETCH_REQUEST,
  postsActions,
  type PostsFetchRequestAction,
} from './actions'

function* fetchPostsWorker(action: PostsFetchRequestAction): SagaIterator {
  try {
    const response = yield call(fetchPostsList, {
      page: action.payload.page,
    })
    yield put(postsActions.fetchSuccess(response))
  } catch (error) {
    if (axios.isAxiosError(error)) {
      yield put(
        postsActions.fetchFailure(
          error.response?.data?.message ?? error.message ?? 'Failed to load posts',
        ),
      )
      return
    }

    yield put(postsActions.fetchFailure('Failed to load posts'))
  }
}

export function* postsSaga(): SagaIterator {
  yield takeLatest(POSTS_FETCH_REQUEST, fetchPostsWorker)
}
