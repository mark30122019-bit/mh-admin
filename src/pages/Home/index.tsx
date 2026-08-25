import { Typography } from 'antd'

/** Главная страница (дашборд). TODO: подключить Layout и posts-модуль. */
export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Typography.Title level={1} className="!m-0">
        hello world
      </Typography.Title>
    </div>
  )
}
