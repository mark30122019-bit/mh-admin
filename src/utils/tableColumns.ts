import type { CSSProperties } from 'react'

/**
 * Фиксированные ширины колонок админ-таблиц (table-layout: fixed).
 * Задают пропорции и потолок для ellipsis — длинный текст не раздувает соседние колонки.
 */
export const POSTS_TABLE_COLS = {
  id: 64,
  preview: 92,
  title: 280,
  author: 200,
  tags: 320,
  created: 168,
  actions: 96,
} as const

export const AUTHORS_TABLE_COLS = {
  id: 64,
  avatar: 96,
  name: 180,
  lastName: 180,
  secondName: 140,
  created: 168,
  actions: 96,
} as const

export const TAGS_TABLE_COLS = {
  id: 64,
  name: 320,
  code: 160,
  priority: 96,
  created: 168,
  actions: 96,
} as const

/**
 * CSS-переменные для равномерного заполнения тела таблицы:
 * height: calc(var(--table-body-y) * 1px / var(--table-rows))
 *
 * +2px к y закрывает микродырку снизу (subpixel / border Ant Table).
 */
export function tableFillStyle(
  bodyScrollY: number,
  rowCount: number,
): CSSProperties {
  return {
    ['--table-body-y' as string]: String(
      Math.max(0, Math.floor(bodyScrollY) + 2),
    ),
    ['--table-rows' as string]: String(Math.max(1, rowCount)),
  }
}
