import type { AppState } from './reducer'

export type AppModuleRootState = {
  app: AppState
}

export function selectAppLanguage(state: AppModuleRootState): AppState['language'] {
  return state.app.language
}
