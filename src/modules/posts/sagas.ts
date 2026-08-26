import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import {
  createPost,
  deletePost,
  fetchAuthorsList,
  fetchPostDetail,
  fetchPostsList,
  fetchTagsList,
  parseApiError,
  updatePost,
  type AuthorListItem,
  type PostDetail,
  type PostFormPayload,
  type PostsListResponse,
  type TagListItem,
} from '@/api'
import { generateEntityCode } from '@/utils/generateCode'
import { idsEqual } from '@/utils/entityId'
import { mergePostListItemWithForm } from '@/utils/mergePostListItem'
import {
  POSTS_DELETE_REQUEST,
  POSTS_DETAIL_REQUEST,
  POSTS_FETCH_REQUEST,
  POSTS_REFERENCES_REQUEST,
  POSTS_SAVE_REQUEST,
  postsActions,
  type PostsDeleteRequestAction,
  type PostsDetailRequestAction,
  type PostsFetchRequestAction,
  type PostsSaveRequestAction,
} from './actions'
import { selectPostDetail } from './selectors'

function* resolvePostCode(id?: number): SagaIterator {
  if (!id) {
    return generateEntityCode('post')
  }

  const detail: PostDetail | null = yield select(selectPostDetail)
  if (detail && detail.id === id) {
    return detail.code
  }

  const fetched: PostDetail = yield call(fetchPostDetail, id)
  return fetched.code
}

function* fetchPostsWorker(action: PostsFetchRequestAction): SagaIterator {
  try {
    // Не затираем список сырым ответом, пока идёт save (там merge формы).
    const saving: boolean = yield select(
      (state: { posts?: { saving?: boolean } }) =>
        Boolean(state.posts?.saving),
    )
    if (saving) {
      return
    }

    const response = yield call(fetchPostsList, { page: action.payload.page })
    yield put(postsActions.fetchSuccess(response))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load posts')
    yield put(postsActions.fetchFailure(parsed.message))
  }
}

function* fetchPostDetailWorker(action: PostsDetailRequestAction): SagaIterator {
  try {
    const detail = yield call(fetchPostDetail, action.payload.id)
    yield put(postsActions.detailSuccess(detail))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load post')
    yield put(postsActions.detailFailure(parsed.message))
  }
}

function* savePostWorker(action: PostsSaveRequestAction): SagaIterator {
  const { id, values, page } = action.payload

  try {
    const code: string = yield call(resolvePostCode, id)
    const payload: PostFormPayload = { ...values, code }

    let savedId = id
    if (id) {
      yield call(updatePost, id, payload)
    } else {
      savedId = yield call(createPost, payload)
    }

    yield put(postsActions.saveSuccess())

    // Свежий справочник + список; author/tags в list иногда отстают от save.
    const authors: AuthorListItem[] = yield call(fetchAuthorsList)
    const tags: TagListItem[] = yield call(fetchTagsList)
    yield put(postsActions.referencesSuccess(authors, tags))

    const response: PostsListResponse = yield call(fetchPostsList, { page })
    const items =
      savedId != null
        ? response.items.map((item) =>
            idsEqual(item.id, savedId)
              ? mergePostListItemWithForm(item, values, authors, tags)
              : item,
          )
        : response.items

    yield put(
      postsActions.fetchSuccess({
        items,
        pagination: response.pagination,
      }),
    )
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to save post')
    yield put(postsActions.saveFailure(parsed.message, parsed.fieldErrors))
  }
}

function* deletePostWorker(action: PostsDeleteRequestAction): SagaIterator {
  try {
    yield call(deletePost, action.payload.id)
    yield put(postsActions.deleteSuccess())
    yield put(postsActions.fetchRequest(action.payload.page))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to delete post')
    yield put(postsActions.deleteFailure(parsed.message))
  }
}

function* fetchReferencesWorker(): SagaIterator {
  try {
    const authors = yield call(fetchAuthorsList)
    const tags = yield call(fetchTagsList)
    yield put(postsActions.referencesSuccess(authors, tags))
  } catch (error) {
    const parsed = parseApiError(error, 'Failed to load references')
    yield put(postsActions.referencesFailure(parsed.message))
  }
}

export function* postsSaga(): SagaIterator {
  yield takeLatest(POSTS_FETCH_REQUEST, fetchPostsWorker)
  yield takeLatest(POSTS_DETAIL_REQUEST, fetchPostDetailWorker)
  yield takeLatest(POSTS_SAVE_REQUEST, savePostWorker)
  yield takeLatest(POSTS_DELETE_REQUEST, deletePostWorker)
  yield takeLatest(POSTS_REFERENCES_REQUEST, fetchReferencesWorker)
}
