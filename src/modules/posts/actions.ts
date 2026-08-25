import type {
  ApiFieldError,
  AuthorListItem,
  PostDetail,
  PostFormInput,
  PostsListResponse,
  TagListItem,
} from '@/api'

export const POSTS_FETCH_REQUEST = 'posts/FETCH_REQUEST' as const
export const POSTS_FETCH_SUCCESS = 'posts/FETCH_SUCCESS' as const
export const POSTS_FETCH_FAILURE = 'posts/FETCH_FAILURE' as const

export const POSTS_DETAIL_REQUEST = 'posts/DETAIL_REQUEST' as const
export const POSTS_DETAIL_SUCCESS = 'posts/DETAIL_SUCCESS' as const
export const POSTS_DETAIL_FAILURE = 'posts/DETAIL_FAILURE' as const
export const POSTS_DETAIL_CLEAR = 'posts/DETAIL_CLEAR' as const

export const POSTS_SAVE_REQUEST = 'posts/SAVE_REQUEST' as const
export const POSTS_SAVE_SUCCESS = 'posts/SAVE_SUCCESS' as const
export const POSTS_SAVE_FAILURE = 'posts/SAVE_FAILURE' as const

export const POSTS_DELETE_REQUEST = 'posts/DELETE_REQUEST' as const
export const POSTS_DELETE_SUCCESS = 'posts/DELETE_SUCCESS' as const
export const POSTS_DELETE_FAILURE = 'posts/DELETE_FAILURE' as const

export const POSTS_REFERENCES_REQUEST = 'posts/REFERENCES_REQUEST' as const
export const POSTS_REFERENCES_SUCCESS = 'posts/REFERENCES_SUCCESS' as const
export const POSTS_REFERENCES_FAILURE = 'posts/REFERENCES_FAILURE' as const

export type PostsFetchRequestAction = {
  type: typeof POSTS_FETCH_REQUEST
  payload: { page: number }
}

export type PostsFetchSuccessAction = {
  type: typeof POSTS_FETCH_SUCCESS
  payload: PostsListResponse
}

export type PostsFetchFailureAction = {
  type: typeof POSTS_FETCH_FAILURE
  payload: { message: string }
}

export type PostsDetailRequestAction = {
  type: typeof POSTS_DETAIL_REQUEST
  payload: { id: number }
}

export type PostsDetailSuccessAction = {
  type: typeof POSTS_DETAIL_SUCCESS
  payload: { detail: PostDetail }
}

export type PostsDetailFailureAction = {
  type: typeof POSTS_DETAIL_FAILURE
  payload: { message: string }
}

export type PostsDetailClearAction = { type: typeof POSTS_DETAIL_CLEAR }

export type PostsSaveRequestAction = {
  type: typeof POSTS_SAVE_REQUEST
  payload: { id?: number; values: PostFormInput; page: number }
}

export type PostsSaveSuccessAction = { type: typeof POSTS_SAVE_SUCCESS }

export type PostsSaveFailureAction = {
  type: typeof POSTS_SAVE_FAILURE
  payload: { message: string; fieldErrors: ApiFieldError[] }
}

export type PostsDeleteRequestAction = {
  type: typeof POSTS_DELETE_REQUEST
  payload: { id: number; page: number }
}

export type PostsDeleteSuccessAction = { type: typeof POSTS_DELETE_SUCCESS }
export type PostsDeleteFailureAction = {
  type: typeof POSTS_DELETE_FAILURE
  payload: { message: string }
}

export type PostsReferencesRequestAction = {
  type: typeof POSTS_REFERENCES_REQUEST
}

export type PostsReferencesSuccessAction = {
  type: typeof POSTS_REFERENCES_SUCCESS
  payload: {
    authors: AuthorListItem[]
    tags: TagListItem[]
  }
}

export type PostsReferencesFailureAction = {
  type: typeof POSTS_REFERENCES_FAILURE
  payload: { message: string }
}

export type PostsAction =
  | PostsFetchRequestAction
  | PostsFetchSuccessAction
  | PostsFetchFailureAction
  | PostsDetailRequestAction
  | PostsDetailSuccessAction
  | PostsDetailFailureAction
  | PostsDetailClearAction
  | PostsSaveRequestAction
  | PostsSaveSuccessAction
  | PostsSaveFailureAction
  | PostsDeleteRequestAction
  | PostsDeleteSuccessAction
  | PostsDeleteFailureAction
  | PostsReferencesRequestAction
  | PostsReferencesSuccessAction
  | PostsReferencesFailureAction

export const postsActions = {
  fetchRequest: (page = 1): PostsFetchRequestAction => ({
    type: POSTS_FETCH_REQUEST,
    payload: { page },
  }),
  fetchSuccess: (payload: PostsListResponse): PostsFetchSuccessAction => ({
    type: POSTS_FETCH_SUCCESS,
    payload,
  }),
  fetchFailure: (message: string): PostsFetchFailureAction => ({
    type: POSTS_FETCH_FAILURE,
    payload: { message },
  }),
  detailRequest: (id: number): PostsDetailRequestAction => ({
    type: POSTS_DETAIL_REQUEST,
    payload: { id },
  }),
  detailSuccess: (detail: PostDetail): PostsDetailSuccessAction => ({
    type: POSTS_DETAIL_SUCCESS,
    payload: { detail },
  }),
  detailFailure: (message: string): PostsDetailFailureAction => ({
    type: POSTS_DETAIL_FAILURE,
    payload: { message },
  }),
  detailClear: (): PostsDetailClearAction => ({ type: POSTS_DETAIL_CLEAR }),
  saveRequest: (
    values: PostFormInput,
    page: number,
    id?: number,
  ): PostsSaveRequestAction => ({
    type: POSTS_SAVE_REQUEST,
    payload: { id, values, page },
  }),
  saveSuccess: (): PostsSaveSuccessAction => ({ type: POSTS_SAVE_SUCCESS }),
  saveFailure: (
    message: string,
    fieldErrors: ApiFieldError[] = [],
  ): PostsSaveFailureAction => ({
    type: POSTS_SAVE_FAILURE,
    payload: { message, fieldErrors },
  }),
  deleteRequest: (id: number, page: number): PostsDeleteRequestAction => ({
    type: POSTS_DELETE_REQUEST,
    payload: { id, page },
  }),
  deleteSuccess: (): PostsDeleteSuccessAction => ({ type: POSTS_DELETE_SUCCESS }),
  deleteFailure: (message: string): PostsDeleteFailureAction => ({
    type: POSTS_DELETE_FAILURE,
    payload: { message },
  }),
  referencesRequest: (): PostsReferencesRequestAction => ({
    type: POSTS_REFERENCES_REQUEST,
  }),
  referencesSuccess: (
    authors: AuthorListItem[],
    tags: TagListItem[],
  ): PostsReferencesSuccessAction => ({
    type: POSTS_REFERENCES_SUCCESS,
    payload: { authors, tags },
  }),
  referencesFailure: (message: string): PostsReferencesFailureAction => ({
    type: POSTS_REFERENCES_FAILURE,
    payload: { message },
  }),
}

export type { PostListItem } from '@/api/posts.types'
