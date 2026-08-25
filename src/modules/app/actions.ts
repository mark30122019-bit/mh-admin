import type { AppLanguage } from './types'

export const APP_CHANGE_LANGUAGE = 'app/CHANGE_LANGUAGE' as const

export type AppChangeLanguageAction = {
  type: typeof APP_CHANGE_LANGUAGE
  payload: { lang: AppLanguage }
}

export type AppAction = AppChangeLanguageAction

export const appActions = {
  changeLanguage: (lang: AppLanguage): AppChangeLanguageAction => ({
    type: APP_CHANGE_LANGUAGE,
    payload: { lang },
  }),
}
