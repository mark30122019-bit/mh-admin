export function appendFormValue(
  formData: FormData,
  key: string,
  value: string | number | boolean | File | undefined | null,
): void {
  if (value === undefined || value === null || value === '') return

  if (value instanceof File) {
    formData.append(key, value)
    return
  }

  formData.append(key, String(value))
}

export function appendFormNumberArray(
  formData: FormData,
  key: string,
  values: number[] | undefined,
): void {
  if (!values?.length) return

  values.forEach((value) => {
    formData.append(`${key}[]`, String(value))
  })
}

export function appendFormStringArray(
  formData: FormData,
  key: string,
  values: string[] | undefined,
): void {
  if (!values?.length) return

  values.forEach((value) => {
    formData.append(`${key}[]`, value)
  })
}
