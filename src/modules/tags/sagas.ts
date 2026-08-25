import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import {
  createTag,
  deleteTag,
  fetchTagDetail,
  fetchTagsList,
  parseApiError,
  updateTag,
  type TagDetail,
  type TagFormPayload,
  type TagListItem,
} from '@/api'
import { generateEntityCode } from '@/utils/generateCode'
import {
  TAGS_DELETE_REQUEST,
  TAGS_DETAIL_REQUEST,
  TAGS_FETCH_REQUEST,
  TAGS_SAVE_REQUEST,
  tagsActions,
  type TagsDeleteRequestAction,
  type TagsDetailRequestAction,
  type TagsSaveRequestAction,
} from './actions'
import { selectTagDetail, selectTagsItems } from './selectors'

function* resolveTagCode(id?: number): SagaIterator {
  if (!id) {
    return generateEntityCode('tag')
  }

  const items: TagListItem[] = yield select(selectTagsItems)
  const fromList = items.find((tag) => tag.id === id)
  if (fromList) {
    return fromList.code
  }

  const detail: TagDetail | null = yield select(selectTagDetail)
  if (detail && detail.id === id) {
    return detail.code
  }

  const fetched: TagDetail = yield call(fetchTagDetail, id)
  return fetched.code
}

function* fetchTagsWorker(): SagaIterator {
  try {
    const items = yield call(fetchTagsList)
    yield put(tagsActions.fetchSuccess(items))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load tags')
    yield put(tagsActions.fetchFailure(parsed.message))
  }
}

function* fetchTagDetailWorker(action: TagsDetailRequestAction): SagaIterator {
  try {
    const detail = yield call(fetchTagDetail, action.payload.id)
    yield put(tagsActions.detailSuccess(detail))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load tag')
    yield put(tagsActions.detailFailure(parsed.message))
  }
}

function* saveTagWorker(action: TagsSaveRequestAction): SagaIterator {
  const { id, values } = action.payload

  try {
    const code: string = yield call(resolveTagCode, id)
    const payload: TagFormPayload = { ...values, code }

    if (id) {
      yield call(updateTag, id, payload)
    } else {
      yield call(createTag, payload)
    }

    yield put(tagsActions.saveSuccess())
    yield put(tagsActions.fetchRequest())
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to save tag')
    yield put(tagsActions.saveFailure(parsed.message, parsed.fieldErrors))
  }
}

function* deleteTagWorker(action: TagsDeleteRequestAction): SagaIterator {
  try {
    yield call(deleteTag, action.payload.id)
    yield put(tagsActions.deleteSuccess())
    yield put(tagsActions.fetchRequest())
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to delete tag')
    yield put(tagsActions.deleteFailure(parsed.message))
  }
}

export function* tagsSaga(): SagaIterator {
  yield takeLatest(TAGS_FETCH_REQUEST, fetchTagsWorker)
  yield takeLatest(TAGS_DETAIL_REQUEST, fetchTagDetailWorker)
  yield takeLatest(TAGS_SAVE_REQUEST, saveTagWorker)
  yield takeLatest(TAGS_DELETE_REQUEST, deleteTagWorker)
}
