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

  useEffect(() => {
    if (!open) {
      setReady(false)
      return
    }

    if (!editingId) {
      setReady(true)
      return
    }

    loadStartedAtRef.current = Date.now()
    setReady(false)
  }, [open, editingId])

  useEffect(() => {
    if (!open || !editingId) return

    if (failed) {
      setReady(true)
      return
    }

    if (detailLoading || !detailReady || extraPending) return

    hydrate()

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
    hydrate,
    minSkeletonMs,
  ])

  return Boolean(editingId) && !ready
}
