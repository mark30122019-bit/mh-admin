export interface TagListItem {
  id: number
  name: string
  code: string
  /** Необязателен: у части тегов на бэкенде поле отсутствует. */
  sort?: number | null
  updatedAt: string
  createdAt: string
}

export interface TagDetail {
  id: number
  name: string
  code: string
  sort?: number | null
  updatedAt: string
  createdAt: string
}

/** Поля формы тега (без code — генерируется только при создании). */
export interface TagFormInput {
  name: string
  sort?: number
}

/** Payload для API create/update, включая code. */
export interface TagFormPayload extends TagFormInput {
  code: string
}
