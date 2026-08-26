import { useEffect, useRef } from 'react'
import { getAccessToken } from '@/api'

/**
 * Window Focus Revalidation: при возврате на вкладку/окно
 * тихо обновляет данные (без скелетона, если список уже загружен).
 *
 * Слушаем и `focus`, и `visibilitychange` — при переключении вкладок
 * браузеры иногда дают только одно из событий.
 */
export function useDataRevalidation(revalidate: () => void): void {
  const revalidateRef = useRef(revalidate)
  revalidateRef.current = revalidate

  useEffect(() => {
    const run = () => {
      if (!getAccessToken()) return
      revalidateRef.current()
    }

    const handleFocus = () => {
      run()
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        run()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])
}
