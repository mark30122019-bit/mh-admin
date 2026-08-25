import type { FormInstance } from 'antd'
import { useEffect } from 'react'
import type { ApiFieldError } from '@/api'
import { mapFieldErrorsToFormFields } from '@/api'
import { notification } from '@/components/ui'

export function useFormApiErrors(
  form: FormInstance,
  fieldErrors: ApiFieldError[],
  saveError: string | null,
  entityLabel: string,
): void {
  useEffect(() => {
    if (fieldErrors.length === 0) return
    form.setFields(mapFieldErrorsToFormFields(fieldErrors))
  }, [fieldErrors, form])

  useEffect(() => {
    if (!saveError || fieldErrors.length > 0) return

    notification.error({
      message: `${entityLabel} save failed`,
      description: saveError,
    })
  }, [entityLabel, fieldErrors.length, saveError])
}
