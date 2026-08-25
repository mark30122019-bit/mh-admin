import { useDispatch, useSelector } from 'react-redux'
import { Select } from '@/components/ui'
import { appActions } from '@/modules/app/actions'
import { selectAppLanguage } from '@/modules/app/selectors'
import type { AppModuleRootState } from '@/modules/app/selectors'
import type { AppLanguage } from '@/modules/app/types'

const LANGUAGE_OPTIONS: Array<{ value: AppLanguage; label: string }> = [
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' },
]

/** Переключатель языка в шапке: Redux + localStorage через `changeLanguage`. */
export function LanguageSwitcher() {
  const dispatch = useDispatch()
  const language = useSelector((state: AppModuleRootState) =>
    selectAppLanguage(state),
  )

  return (
    <Select
      value={language}
      options={LANGUAGE_OPTIONS}
      onChange={(value: AppLanguage) => {
        dispatch(appActions.changeLanguage(value))
      }}
      allowClear={false}
      showSearch={false}
      style={{ width: 72 }}
      popupMatchSelectWidth={false}
      aria-label="Language"
    />
  )
}
