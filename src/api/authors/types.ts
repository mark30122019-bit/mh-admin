export interface AuthorListItem {
  id: number
  name: string
  lastName: string
  secondName: string
  shortDescription?: string
  avatar: ApiPicture | null
  updatedAt: string
  createdAt: string
}

export interface AuthorDetail {
  id: number
  name: string
  lastName: string
  secondName: string
  shortDescription: string
  description: string
  avatar: ApiPicture | null
  updatedAt: string
  createdAt: string
}

export interface ApiPicture {
  id: number
  name: string
  url: string
}

export interface AuthorFormPayload {
  name: string
  lastName: string
  secondName?: string
  shortDescription?: string
  description?: string
  avatar?: File
  removeAvatar?: boolean
}
