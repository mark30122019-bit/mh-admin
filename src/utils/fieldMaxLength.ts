/** Базовые лимиты символов для полей форм (не через Form.Item rules). */
export const FIELD_MAX_LENGTH = {
  tagName: 100,
  authorName: 50,
  authorLastName: 50,
  authorSecondName: 50,
  authorShortDescription: 1000,
  authorDescription: 2000,
  postTitle: 150,
} as const

/**
 * Динамический maxLength для Input/TextArea:
 * если значение с бэка длиннее базы — лимит = фактическая длина (счётчик 140/140);
 * иначе — стандартный лимит. Без Form rules, чтобы старые длинные записи не краснели.
 */
export function resolveInputMaxLength(
  baseLimit: number,
  value?: string | null,
): number {
  const length = value?.length ?? 0
  return Math.max(baseLimit, length)
}
