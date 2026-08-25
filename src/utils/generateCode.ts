/**
 * Уникальный символьный код для сущности при создании.
 * Пример: `post-a1b2c3d4`, `tag-e5f6g7h8`
 */
export function generateEntityCode(
  prefix: string,
  length: number = 8,
): string {
  const safeLength = Math.min(12, Math.max(8, length))
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, safeLength)
  return `${prefix}-${id}`
}
