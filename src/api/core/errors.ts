import axios from 'axios'
import { getBadRequestMessage, getValidationErrors } from './client'
import type { ApiFieldError } from './types'

export interface ParsedApiError {
  message: string
  fieldErrors: ApiFieldError[]
}

export function parseApiError(error: unknown, fallback: string): ParsedApiError {
  const fieldErrors = getValidationErrors(error)
  if (fieldErrors.length > 0) {
    return {
      message: fieldErrors.map((item) => item.message).join(', '),
      fieldErrors,
    }
  }

  const badRequestMessage = getBadRequestMessage(error)
  if (badRequestMessage) {
    return { message: badRequestMessage, fieldErrors: [] }
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return {
      message: data?.message ?? error.message ?? fallback,
      fieldErrors: [],
    }
  }

  return { message: fallback, fieldErrors: [] }
}

export function mapFieldErrorsToFormFields(
  fieldErrors: ApiFieldError[],
): Array<{ name: string | string[]; errors: string[] }> {
  return fieldErrors.map((item) => ({
    name: item.field.includes('.') ? item.field.split('.') : item.field,
    errors: [item.message],
  }))
}
