import type { FormInstance } from 'antd'
import { useEffect } from 'react'
import type { ApiFieldError } from '@/api'
import { mapFieldErrorsToFormFields } from '@/api'
import { notification } from '@/components/ui'

/**
 * Проставляет fieldErrors в Form и показывает notification при общей ошибке save.
 * `saveFailedTitle` — уже переведённый заголовок (не хардкод EN).
 */
export function useFormApiErrors(
  form: FormInstance,
  fieldErrors: ApiFieldError[],
  saveError: string | null,
  saveFailedTitle: string,
): void {
  useEffect(() => {
    if (fieldErrors.length === 0) return
    form.setFields(mapFieldErrorsToFormFields(fieldErrors))
  }, [fieldErrors, form])

  useEffect(() => {
    if (!saveError || fieldErrors.length > 0) return

    notification.error({
      message: saveFailedTitle,
      description: saveError,
    })
  }, [fieldErrors.length, saveError, saveFailedTitle])
}
