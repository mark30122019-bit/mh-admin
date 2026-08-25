/** Приводит ID сущности к number; API часто отдаёт id строкой. */
export function toEntityId(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** Сравнение ID без учёта string vs number (`"1"` === `1`). */
export function idsEqual(a: unknown, b: unknown): boolean {
  const left = toEntityId(a)
  const right = toEntityId(b)
  return left != null && right != null && left === right
}
