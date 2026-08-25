import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { PostListItem } from '@/api/posts.types'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import {
  Button,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  notification,
} from '@/components/ui'
import { postsActions } from '@/modules/posts/actions'
import { getPostsModule } from '@/modules/posts/posts.module'
import type { PostsModuleState } from '@/modules/posts/posts.module'
import {
  selectPostsError,
  selectPostsItems,
  selectPostsLoading,
  selectPostsPagination,
} from '@/modules/posts/selectors'

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Контент страницы — внутри DynamicModuleLoader, когда posts reducer уже в store. */
function PostsPageContent() {
  const dispatch = useDispatch()
  const items = useSelector((state: PostsModuleState) => selectPostsItems(state))
  const pagination = useSelector((state: PostsModuleState) =>
    selectPostsPagination(state),
  )
  const loading = useSelector((state: PostsModuleState) =>
    selectPostsLoading(state),
  )
  const error = useSelector((state: PostsModuleState) => selectPostsError(state))

  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState<string>('all')

  useEffect(() => {
    if (!error) return

    notification.error({
      message: 'Failed to load posts',
      description: error,
    })
  }, [error])

  const authorOptions = useMemo(() => {
    const uniqueAuthors = Array.from(
      new Set(items.map((item) => item.authorName).filter(Boolean)),
    ).sort()

    return [
      { value: 'all', label: 'All authors' },
      ...uniqueAuthors.map((author) => ({ value: author, label: author })),
    ]
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const matchesAuthor =
        authorFilter === 'all' || item.authorName === authorFilter
      return matchesSearch && matchesAuthor
    })
  }, [authorFilter, items, search])

  const columns: ColumnsType<PostListItem> = [
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
      dataIndex: 'authorName',
      width: 160,
    },
    {
      title: 'Tags',
      dataIndex: 'tagNames',
      width: 180,
      render: (tags: string[] | undefined) => (
        <Space wrap size={[4, 4]}>
          {(tags ?? []).map((tag) => (
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
      render: (value: string) => formatCreatedAt(value),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: () => (
        <Space size={4}>
          <Button
            type="text"
            disabled
            icon={<EditOutlined style={{ color: '#bfbfbf' }} />}
          />
          <Button
            type="text"
            disabled
            icon={<DeleteOutlined style={{ color: '#ffccc7' }} />}
          />
        </Space>
      ),
    },
  ]

  const handlePageChange = (page: number) => {
    dispatch(postsActions.fetchRequest(page))
  }

  return (
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
          <Button type="primary" icon={<PlusOutlined />} disabled>
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
            options={authorOptions}
            onChange={setAuthorFilter}
            style={{ width: 180 }}
          />
          <Button icon={<SortAscendingOutlined />} disabled />
        </div>

        <Table<PostListItem>
          columns={columns}
          dataSource={filteredItems}
          loading={loading}
          pagination={false}
          locale={{ emptyText: loading ? 'Loading…' : 'No posts' }}
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
            {pagination.totalCount} posts
          </Typography.Text>
          <Pagination
            current={pagination.currentPage}
            pageSize={pagination.perPage}
            total={pagination.totalCount}
            onChange={handlePageChange}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default function PostsPage() {
  return (
    <DynamicModuleLoader modules={[getPostsModule()]} strictMode>
      <PostsPageContent />
    </DynamicModuleLoader>
  )
}
