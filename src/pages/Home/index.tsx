import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { MainLayout } from '@/components/Layout'
import { useHomeRedirect } from '@/routes/AuthRoute'
import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
  notification,
  notifyApiErrors,
} from '@/components/ui'

type DemoRow = {
  id: number
  title: string
  author: string
  status: 'draft' | 'published'
  tags: string[]
}

const DEMO_ROWS: DemoRow[] = [
  {
    id: 1,
    title: 'Первый пост',
    author: 'Иван Иванов',
    status: 'published',
    tags: ['react', 'redux'],
  },
  {
    id: 2,
    title: 'Черновик статьи',
    author: 'Пётр Петров',
    status: 'draft',
    tags: ['typescript'],
  },
  {
    id: 3,
    title: 'Гайд по Saga',
    author: 'Анна Сидорова',
    status: 'published',
    tags: ['saga', 'redux'],
  },
]

const AUTHOR_OPTIONS = [
  { value: 1, label: 'Иван Иванов' },
  { value: 2, label: 'Пётр Петров' },
  { value: 3, label: 'Анна Сидорова' },
]

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Черновик' },
  { value: 'published', label: 'Опубликован' },
]

type DemoFormValues = {
  email: string
  password: string
  title: string
  authorId?: number
  status?: string
}

export default function HomePage() {
  // TODO(auth): после входа редирект на /posts, иначе на /login
  useHomeRedirect()

  const [form] = Form.useForm<DemoFormValues>()
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState(DEMO_ROWS)

  const columns: ColumnsType<DemoRow> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
    },
    {
      title: 'Заголовок',
      dataIndex: 'title',
    },
    {
      title: 'Автор',
      dataIndex: 'author',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (status: DemoRow['status']) =>
        status === 'published' ? (
          <Tag color="green">Опубликован</Tag>
        ) : (
          <Tag color="default">Черновик</Tag>
        ),
    },
    {
      title: 'Теги',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <Space wrap size={[4, 4]}>
          {tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              form.setFieldsValue({
                title: record.title,
                status: record.status,
              })
              setModalOpen(true)
            }}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить запись?"
            description={`«${record.title}» будет удалена`}
            onConfirm={() => {
              setRows((prev) => prev.filter((row) => row.id !== record.id))
              message.success('Пост успешно удалён')
            }}
          >
            <Button type="link" danger>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const onFinish = (values: DemoFormValues) => {
    message.success(`Форма отправлена: ${values.email}`)
    console.info('demo form values', values)
  }

  const onFinishFailed = () => {
    notification.warning({
      message: 'Ошибка валидации формы',
      description: 'Проверьте заполнение обязательных полей',
    })
  }

  const simulateApiLoading = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1500)
  }

  return (
    <MainLayout>
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: '28px 32px',
        }}
      >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          Песочница для проверки компонентов Ant Design из ТЗ. ConfigProvider
          (ru_RU), Layout / Sider / Header / Content / Menu — в каркасе страницы.
        </Typography.Paragraph>

        <section>
          <Typography.Title level={4}>Button / Space / Spin</Typography.Title>
          <Space wrap>
            <Button type="primary" onClick={() => message.success('Primary OK')}>
              Primary
            </Button>
            <Button onClick={() => message.info('Default click')}>Default</Button>
            <Button danger onClick={() => message.error('Danger click')}>
              Danger
            </Button>
            <Button type="primary" loading>
              Loading
            </Button>
            <Button onClick={simulateApiLoading}>Показать Spin 1.5с</Button>
            <Spin spinning={loading}>
              <div style={{ padding: '8px 12px', border: '1px dashed #d9d9d9' }}>
                Область с Spin
              </div>
            </Spin>
          </Space>
        </section>

        <section>
          <Typography.Title level={4}>
            message / notification
          </Typography.Title>
          <Space wrap>
            <Button onClick={() => message.success('Пост успешно удалён')}>
              message.success
            </Button>
            <Button
              onClick={() =>
                notification.error({
                  message: 'Системная ошибка',
                  description: 'Не удалось связаться с REST API',
                })
              }
            >
              notification.error
            </Button>
            <Button
              onClick={() =>
                notifyApiErrors('Ошибки валидации API', {
                  title: ['Поле обязательно'],
                  email: ['Некорректный email', 'Email уже занят'],
                })
              }
            >
              notifyApiErrors
            </Button>
          </Space>
        </section>

        <section>
          <Typography.Title level={4}>
            Form / Form.Item / Input / Input.Password / Select
          </Typography.Title>
          <Form<DemoFormValues>
            form={form}
            layout="vertical"
            style={{ maxWidth: 480 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ status: 'draft' }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Введите email' },
                { type: 'email', message: 'Некорректный email' },
              ]}
            >
              <Input placeholder="admin@machineheads.ru" />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              label="Заголовок поста"
              name="title"
              rules={[{ required: true, message: 'Введите заголовок' }]}
            >
              <Input placeholder="Заголовок" />
            </Form.Item>

            <Form.Item label="Автор" name="authorId">
              <Select
                placeholder="Выберите автора"
                options={AUTHOR_OPTIONS}
              />
            </Form.Item>

            <Form.Item label="Статус" name="status">
              <Select options={STATUS_OPTIONS} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Отправить форму
                </Button>
                <Button onClick={() => form.resetFields()}>Сбросить</Button>
                <Button
                  onClick={() => {
                    form.setFields([
                      {
                        name: 'title',
                        errors: ['Заголовок уже существует (сервер)'],
                      },
                    ])
                    notification.error({
                      message: 'Серверная ошибка валидации',
                      description: 'Заголовок уже существует',
                    })
                  }}
                >
                  Эмуляция ошибки API
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </section>

        <section>
          <Typography.Title level={4}>
            Tag / Modal / Popconfirm
          </Typography.Title>
          <Space wrap>
            <Tag color="green">published</Tag>
            <Tag color="default">draft</Tag>
            <Tag color="blue">react</Tag>
            <Tag color="purple">redux</Tag>
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Открыть Modal
            </Button>
            <Popconfirm
              title="Подтвердить действие?"
              onConfirm={() => message.success('Подтверждено')}
            >
              <Button>Popconfirm</Button>
            </Popconfirm>
          </Space>
        </section>

        <section>
          <Typography.Title level={4}>
            Table + Pagination (из headers API)
          </Typography.Title>
          <Table<DemoRow> columns={columns} dataSource={rows} />
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={42}
              onChange={(nextPage, nextSize) => {
                setPage(nextPage)
                setPageSize(nextSize)
                message.info(`Страница ${nextPage}, размер ${nextSize}`)
              }}
            />
          </div>
        </section>
      </Space>

      <Modal
        title="Добавление / редактирование"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          form
            .validateFields(['title', 'status'])
            .then(() => {
              message.success('Сохранено (демо)')
              setModalOpen(false)
            })
            .catch(() => undefined)
        }}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Заголовок"
            name="title"
            rules={[{ required: true, message: 'Введите заголовок' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Статус" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </MainLayout>
  )
}
