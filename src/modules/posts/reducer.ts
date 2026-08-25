import type { AnyAction } from 'redux'
import type { ApiPagination, PostListItem } from '@/api/posts.types'
import type { PostsAction } from './actions'
import {
  POSTS_FETCH_FAILURE,
  POSTS_FETCH_REQUEST,
  POSTS_FETCH_SUCCESS,
} from './actions'

export interface PostsState {
  items: PostListItem[]
  pagination: ApiPagination
  loading: boolean
  error: string | null
}

const initialPagination: ApiPagination = {
  currentPage: 1,
  pageCount: 1,
  perPage: 20,
  totalCount: 0,
}

const initialState: PostsState = {
  items: [],
  pagination: initialPagination,
  loading: false,
  error: null,
}

export function postsReducer(
  state: PostsState = initialState,
  action: AnyAction,
): PostsState {
  const postsAction = action as PostsAction

  switch (postsAction.type) {
    case POSTS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        pagination: {
          ...state.pagination,
          currentPage: postsAction.payload.page,
        },
      }
    case POSTS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: postsAction.payload.items,
        pagination: postsAction.payload.pagination,
      }
    case POSTS_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: postsAction.payload.message,
      }
    default:
      return state
  }
}
