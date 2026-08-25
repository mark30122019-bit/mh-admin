import type { CSSProperties } from 'react'

/**
 * Компактные ширины колонок: сумма умещается в ~1024px при свёрнутом sider (64px)
 * и узких внешних отступах — без горизонтального скролла.
 */
export const POSTS_TABLE_COLS = {
  id: 56,
  preview: 72,
  title: 180,
  author: 140,
  tags: 168,
  created: 112,
  actions: 88,
} as const

export const AUTHORS_TABLE_COLS = {
  id: 56,
  avatar: 72,
  name: 120,
  lastName: 120,
  secondName: 100,
  created: 112,
  actions: 88,
} as const

export const TAGS_TABLE_COLS = {
  id: 56,
  name: 200,
  code: 148,
  priority: 80,
  created: 112,
  actions: 88,
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
