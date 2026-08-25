import type { AppLanguage } from '@/modules/app/types'
import { en, ru, type TranslationDict } from './dictionaries'

export const dictionaries: Record<AppLanguage, TranslationDict> = {
  ru,
  en,
}

type DotPrefix<T extends string, U extends string> = `${T}.${U}`

type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? DotPrefix<K, NestedKeys<T[K]>>
      : never
}[keyof T & string]

export type TranslationKey = NestedKeys<TranslationDict>

export type TranslationParams = Record<string, string | number>

function getByPath(dict: TranslationDict, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = dict

  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }

  return typeof current === 'string' ? current : undefined
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    params[key] != null ? String(params[key]) : `{{${key}}}`,
  )
}

/** Берёт строку перевода по ключу для указанного языка. */
export function translate(
  lang: AppLanguage,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  const value = getByPath(dictionaries[lang], key) ?? getByPath(ru, key) ?? key
  return interpolate(value, params)
}
