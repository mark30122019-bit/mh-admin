import type { PostListItem, PostsListResponse } from '@/api/posts.types'

export const POSTS_FETCH_REQUEST = 'posts/FETCH_REQUEST' as const
export const POSTS_FETCH_SUCCESS = 'posts/FETCH_SUCCESS' as const
export const POSTS_FETCH_FAILURE = 'posts/FETCH_FAILURE' as const

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

export type PostsAction =
  | PostsFetchRequestAction
  | PostsFetchSuccessAction
  | PostsFetchFailureAction

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
}

export type { PostListItem }
