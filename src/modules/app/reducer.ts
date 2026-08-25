import type { AnyAction } from 'redux'
import {
  APP_CHANGE_LANGUAGE,
  type AppAction,
} from './actions'
import {
  persistLanguage,
  readStoredLanguage,
  type AppLanguage,
} from './types'

export interface AppState {
  language: AppLanguage
}

const initialState: AppState = {
  language: readStoredLanguage(),
}

export function appReducer(
  state: AppState = initialState,
  action: AnyAction,
): AppState {
  const appAction = action as AppAction

  switch (appAction.type) {
    case APP_CHANGE_LANGUAGE: {
      const { lang } = appAction.payload
      persistLanguage(lang)
      return { ...state, language: lang }
    }
    default:
      return state
  }
}
