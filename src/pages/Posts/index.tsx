import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from '@/components/ui'
import { getPostsModule } from '@/modules/posts/posts.module'

type PostRow = {
  id: number
  title: string
  author: string
  tags: string[]
  createdAt: string
}

const MOCK_POSTS: PostRow[] = [
  {
    id: 1,
    title: 'The Future of Remote Work',
    author: 'Sarah Chen',
    tags: ['Business'],
    createdAt: 'Aug 21, 2026',
  },
  {
    id: 2,
    title: 'Design Systems at Scale',
    author: 'Marcus Lee',
    tags: ['Design'],
    createdAt: 'Aug 19, 2026',
  },
  {
    id: 3,
    title: 'Minimalist Living Tips',
    author: 'Emily Ross',
    tags: ['Lifestyle'],
    createdAt: 'Aug 17, 2026',
  },
]

const AUTHOR_OPTIONS = [
  { value: 'all', label: 'All authors' },
  { value: 'Sarah Chen', label: 'Sarah Chen' },
  { value: 'Marcus Lee', label: 'Marcus Lee' },
  { value: 'Emily Ross', label: 'Emily Ross' },
]

export default function PostsPage() {
  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState(MOCK_POSTS)

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch = row.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchesAuthor =
        authorFilter === 'all' || row.author === authorFilter
      return matchesSearch && matchesAuthor
    })
  }, [authorFilter, rows, search])

  const columns: ColumnsType<PostRow> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 72,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      width: 160,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: 140,
      render: (tags: string[]) => (
        <Space wrap size={[4, 4]}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                margin: 0,
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                color: '#595959',
              }}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      width: 140,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#595959' }} />}
            onClick={() => message.info(`Edit post #${record.id}`)}
          />
          <Popconfirm
            title="Delete this post?"
            onConfirm={() => {
              setRows((prev) => prev.filter((row) => row.id !== record.id))
              message.success('Post deleted')
            }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: '#ff7875' }} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <DynamicModuleLoader modules={[getPostsModule()]} strictMode>
      <MainLayout>
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: '28px 32px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <Typography.Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              Posts
            </Typography.Title>
            <Button type="primary" icon={<PlusOutlined />}>
              New post
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            <Input.Search
              placeholder="Search by title"
              allowClear
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 280 }}
            />
            <Select
              value={authorFilter}
              options={AUTHOR_OPTIONS}
              onChange={setAuthorFilter}
              style={{ width: 180 }}
            />
            <Button icon={<SortAscendingOutlined />} />
          </div>

          <Table<PostRow>
            columns={columns}
            dataSource={filteredRows}
            pagination={false}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
              paddingTop: 8,
            }}
          >
            <Typography.Text type="secondary">
              {filteredRows.length} posts
            </Typography.Text>
            <Pagination
              current={page}
              pageSize={10}
              total={filteredRows.length}
              onChange={(nextPage) => setPage(nextPage)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </MainLayout>
    </DynamicModuleLoader>
  )
}
