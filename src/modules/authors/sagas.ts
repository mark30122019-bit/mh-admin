import type { SagaIterator } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import {
  createAuthor,
  deleteAuthor,
  fetchAuthorDetail,
  fetchAuthorsList,
  parseApiError,
  updateAuthor,
} from '@/api'
import {
  AUTHORS_DELETE_REQUEST,
  AUTHORS_DETAIL_REQUEST,
  AUTHORS_FETCH_REQUEST,
  AUTHORS_SAVE_REQUEST,
  authorsActions,
  type AuthorsDeleteRequestAction,
  type AuthorsDetailRequestAction,
  type AuthorsSaveRequestAction,
} from './actions'

function* fetchAuthorsWorker(): SagaIterator {
  try {
    const items = yield call(fetchAuthorsList)
    yield put(authorsActions.fetchSuccess(items))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load authors')
    yield put(authorsActions.fetchFailure(parsed.message))
  }
}

function* fetchAuthorDetailWorker(
  action: AuthorsDetailRequestAction,
): SagaIterator {
  try {
    const detail = yield call(fetchAuthorDetail, action.payload.id)
    yield put(authorsActions.detailSuccess(detail))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load author')
    yield put(authorsActions.detailFailure(parsed.message))
  }
}

function* saveAuthorWorker(action: AuthorsSaveRequestAction): SagaIterator {
  const { id, values } = action.payload

  try {
    if (id) {
      yield call(updateAuthor, id, values)
    } else {
      yield call(createAuthor, values)
    }

    yield put(authorsActions.saveSuccess())
    yield put(authorsActions.fetchRequest())
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to save author')
    yield put(authorsActions.saveFailure(parsed.message, parsed.fieldErrors))
  }
}

function* deleteAuthorWorker(action: AuthorsDeleteRequestAction): SagaIterator {
  try {
    yield call(deleteAuthor, action.payload.id)
    yield put(authorsActions.deleteSuccess())
    yield put(authorsActions.fetchRequest())
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to delete author')
    yield put(authorsActions.deleteFailure(parsed.message))
  }
}

export function* authorsSaga(): SagaIterator {
  yield takeLatest(AUTHORS_FETCH_REQUEST, fetchAuthorsWorker)
  yield takeLatest(AUTHORS_DETAIL_REQUEST, fetchAuthorDetailWorker)
  yield takeLatest(AUTHORS_SAVE_REQUEST, saveAuthorWorker)
  yield takeLatest(AUTHORS_DELETE_REQUEST, deleteAuthorWorker)
}
