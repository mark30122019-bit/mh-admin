export interface TagListItem {
  id: number
  name: string
  code: string
  sort: number
  updatedAt: string
  createdAt: string
}

export interface TagDetail {
  id: number
  name: string
  code: string
  sort: number
  updatedAt: string
  createdAt: string
}

/** Поля формы тега (без code — генерируется только при создании). */
export interface TagFormInput {
  name: string
  sort: number
}

/** Payload для API create/update, включая code. */
export interface TagFormPayload extends TagFormInput {
  code: string
}
