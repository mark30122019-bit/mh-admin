import { PageContentSkeleton } from '@/components/ui'
import { useHomeRedirect } from '@/routes/AuthRoute'

/** Корень `/`: редирект на /posts или /login. */
export default function HomePage() {
  useHomeRedirect()
  return <PageContentSkeleton />
}
