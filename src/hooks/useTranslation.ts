import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
  translate,
  type TranslationKey,
  type TranslationParams,
} from '@/i18n'
import { selectAppLanguage } from '@/modules/app/selectors'
import type { AppModuleRootState } from '@/modules/app/selectors'
import type { AppLanguage } from '@/modules/app/types'

type TranslateFn = (key: TranslationKey, params?: TranslationParams) => string

/**
 * Хуки переводов: читает язык из Redux и отдаёт `t(key)` / текущий `lang`.
 */
export function useTranslation(): { t: TranslateFn; lang: AppLanguage } {
  const lang = useSelector((state: AppModuleRootState) =>
    selectAppLanguage(state),
  )

  const t = useCallback<TranslateFn>(
    (key, params) => translate(lang, key, params),
    [lang],
  )

  return { t, lang }
}
