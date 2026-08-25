import { Spin } from '@/components/ui'
import { useHomeRedirect } from '@/routes/AuthRoute'

/** Entry-point `/`: только редирект на /posts или /login. */
export default function HomePage() {
  useHomeRedirect()
  return <Spin fullPage />
}
