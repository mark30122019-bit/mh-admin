export const APP_LANG_STORAGE_KEY = 'app_lang'

export type AppLanguage = 'ru' | 'en'

export function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'ru' || value === 'en'
}

/** Читает язык из localStorage с фолбеком на `ru`. */
export function readStoredLanguage(): AppLanguage {
  if (typeof localStorage === 'undefined') return 'ru'

  const stored = localStorage.getItem(APP_LANG_STORAGE_KEY)
  return isAppLanguage(stored) ? stored : 'ru'
}

export function persistLanguage(lang: AppLanguage): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(APP_LANG_STORAGE_KEY, lang)
}
