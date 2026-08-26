import { useEffect, useRef } from 'react'
import { getAccessToken } from '@/api'

/**
 * Window Focus Revalidation: при возврате фокуса на вкладку/окно
 * тихо обновляет данные (без скелетона, если список уже загружен).
 */
export function useDataRevalidation(revalidate: () => void): void {
  const revalidateRef = useRef(revalidate)
  revalidateRef.current = revalidate

  useEffect(() => {
    const handleFocus = () => {
      if (!getAccessToken()) return
      revalidateRef.current()
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])
}
