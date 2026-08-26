import { useEffect, useRef, useState } from 'react'

type UseEditFormRevealOptions = {
  open: boolean
  editingId: number | null
  detailLoading: boolean
  /** Detail уже в Redux и можно проставить поля формы. */
  detailReady: boolean
  /** Доп. ожидание (например, справочники постов). */
  extraPending?: boolean
  /** Detail/справочники упали — снимаем скелетон без hydrate. */
  failed?: boolean
  minSkeletonMs?: number
  /** Синхронно заполняет форму перед показом. */
  hydrate: () => void
}

/**
 * Пока идёт edit-load — скелетон.
 * Форму показываем только после hydrate и (при быстром ответе) не раньше minSkeletonMs,
 * чтобы не мелькали пустые/disabled инпуты.
 *
 * Hydrate один раз за сессию edit (open + editingId): повторный fetch справочников
 * (focus/visibility) не должен затирать уже выбранные поля (например, нового автора).
 */
export function useEditFormReveal({
  open,
  editingId,
  detailLoading,
  detailReady,
  extraPending = false,
  failed = false,
  minSkeletonMs = 420,
  hydrate,
}: UseEditFormRevealOptions): boolean {
  const [ready, setReady] = useState(() => !editingId)
  const loadStartedAtRef = useRef(0)
  const hydratedKeyRef = useRef<number | null>(null)
  const hydrateRef = useRef(hydrate)
  hydrateRef.current = hydrate

  useEffect(() => {
    if (!open) {
      setReady(false)
      hydratedKeyRef.current = null
      return
    }

    if (!editingId) {
      setReady(true)
      hydratedKeyRef.current = null
      return
    }

    loadStartedAtRef.current = Date.now()
    setReady(false)
    hydratedKeyRef.current = null
  }, [open, editingId])

  useEffect(() => {
    if (!open || !editingId) return

    if (failed) {
      setReady(true)
      return
    }

    if (detailLoading || !detailReady || extraPending) return

    if (hydratedKeyRef.current !== editingId) {
      hydrateRef.current()
      hydratedKeyRef.current = editingId
    }

    const elapsed = Date.now() - loadStartedAtRef.current
    const wait = Math.max(0, minSkeletonMs - elapsed)
    const timer = window.setTimeout(() => {
      setReady(true)
    }, wait)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    open,
    editingId,
    detailLoading,
    detailReady,
    extraPending,
    failed,
    minSkeletonMs,
  ])

  return Boolean(editingId) && !ready
}
