import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons'
import { Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LIST_PAGE_SIZE, getPostsFirstPageMinHeight } from '@/api'
import type { PostListItem } from '@/api/posts.types'
import { DynamicModuleLoader } from '@/components/DynamicModuleLoader'
import { MainLayout } from '@/components/Layout'
import {
  Button,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  message,
  notification,
} from '@/components/ui'
import { useTranslation } from '@/hooks/useTranslation'
import { postsActions } from '@/modules/posts/actions'
import { getPostsModule } from '@/modules/posts/posts.module'
import type { PostsModuleState } from '@/modules/posts/posts.module'
import {
  selectPostsAuthorOptions,
  selectPostsDeletingId,
  selectPostsError,
  selectPostsItems,
  selectPostsLoading,
  selectPostsPagination,
  selectPostsTagOptions,
} from '@/modules/posts/selectors'
import {
  resolvePostAuthorLabel,
  resolvePostTagLabels,
} from '@/utils/orphanLabels'
import {
  isTablePlaceholderRow,
  padTablePage,
  type TablePlaceholderRow,
} from '@/utils/padTablePage'
import { PostFormModal } from './PostFormModal'

type PostTableRow = PostListItem | TablePlaceholderRow

function formatCreatedAt(value: string, locale: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function PostsPageContent() {
  const dispatch = useDispatch()
  const { t, lang } = useTranslation()
  const dateLocale = lang === 'ru' ? 'ru-RU' : 'en-US'
  const items = useSelector((state: PostsModuleState) => selectPostsItems(state))
  const pagination = useSelector((state: PostsModuleState) =>
    selectPostsPagination(state),
  )
  const loading = useSelector((state: PostsModuleState) =>
    selectPostsLoading(state),
  )
  const error = useSelector((state: PostsModuleState) => selectPostsError(state))
  const deletingId = useSelector((state: PostsModuleState) =>
    selectPostsDeletingId(state),
  )
  const authorCatalog = useSelector((state: PostsModuleState) =>
    selectPostsAuthorOptions(state),
  )
  const tagCatalog = useSelector((state: PostsModuleState) =>
    selectPostsTagOptions(state),
  )

  const [search, setSearch] = useState('')
  const [authorFilter, setAuthorFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const prevDeletingIdRef = useRef<number | null>(null)
  const pageRef = useRef(pagination.currentPage)
  pageRef.current = pagination.currentPage

  useEffect(() => {
    if (!error) return
    notification.error({ message: t('posts.loadFailed'), description: error })
  }, [error, t])

  // После удаления автора/тега модуль posts может остаться со старым справочником —
  // при каждом заходе на страницу обновляем references и список.
  useEffect(() => {
    dispatch(postsActions.referencesRequest())
    dispatch(postsActions.fetchRequest(pageRef.current))
  }, [dispatch])

  useEffect(() => {
    if (prevDeletingIdRef.current && deletingId === null) {
      message.success(t('posts.deleted'))
    }
    prevDeletingIdRef.current = deletingId
  }, [deletingId, t])

  const authorOptions = useMemo(() => {
    const uniqueAuthors = Array.from(
      new Set(
        items
          .map((item) => resolvePostAuthorLabel(item, authorCatalog, lang).label)
          .filter(Boolean),
      ),
    ).sort()

    return [
      { value: 'all', label: t('posts.allAuthors') },
      ...uniqueAuthors.map((author) => ({ value: author, label: author })),
    ]
  }, [authorCatalog, items, lang, t])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      const authorLabel = resolvePostAuthorLabel(item, authorCatalog, lang).label
      const matchesAuthor =
        authorFilter === 'all' || authorLabel === authorFilter
      return matchesSearch && matchesAuthor
    })
  }, [authorCatalog, authorFilter, items, lang, search])

  const pageSize = pagination.perPage || LIST_PAGE_SIZE.posts
  const isFirstPage = pagination.currentPage === 1
  const skipPlaceholdersOnFirstPage =
    isFirstPage && filteredItems.length < pageSize

  const tableRows = useMemo(() => {
    if (skipPlaceholdersOnFirstPage) return filteredItems
    return padTablePage(filteredItems, pageSize)
  }, [filteredItems, pageSize, skipPlaceholdersOnFirstPage])

  const openCreateModal = () => {
    setEditingId(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    dispatch(postsActions.detailClear())
  }

  const confirmDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: t('posts.deleteConfirmTitle'),
        content: t('posts.deleteConfirmContent'),
        okText: t('common.delete'),
        cancelText: t('common.cancel'),
        okButtonProps: { danger: true },
        centered: true,
        onOk: () => {
          dispatch(postsActions.deleteRequest(id, pagination.currentPage))
        },
      })
    },
    [dispatch, pagination.currentPage, t],
  )

  const columns: ColumnsType<PostTableRow> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 72,
        render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
      },
      {
        title: t('posts.preview'),
        dataIndex: 'previewPicture',
        width: 88,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          const url = record.previewPicture?.url
          if (!url) {
            return (
              <span style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: 12 }}>
                —
              </span>
            )
          }
          return (
            <img
              src={url}
              alt={record.title}
              width={56}
              height={40}
              style={{
                objectFit: 'cover',
                borderRadius: 6,
                display: 'block',
                background: '#f5f5f5',
              }}
            />
          )
        },
      },
      {
        title: t('posts.postTitle'),
        dataIndex: 'title',
        render: (value, record) => (isTablePlaceholderRow(record) ? null : value),
      },
      {
        title: t('posts.author'),
        dataIndex: 'authorName',
        width: 180,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          const { label, orphan } = resolvePostAuthorLabel(
            record,
            authorCatalog,
            lang,
          )
          return (
            <span style={orphan ? { color: '#cf1322' } : undefined}>
              {label}
            </span>
          )
        },
      },
      {
        title: t('posts.tags'),
        dataIndex: 'tagNames',
        width: 200,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null
          const resolvedTags = resolvePostTagLabels(record, tagCatalog, lang)
          if (resolvedTags.length === 0) {
            return <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>—</span>
          }
          return (
            <Space wrap size={[4, 4]}>
              {resolvedTags.map((tag) => (
                <Tag key={tag.key} color={tag.orphan ? 'error' : undefined}>
                  {tag.label}
                </Tag>
              ))}
            </Space>
          )
        },
      },
      {
        title: t('common.createdAt'),
        dataIndex: 'createdAt',
        width: 140,
        render: (value: string, record) =>
          isTablePlaceholderRow(record)
            ? null
            : formatCreatedAt(value, dateLocale),
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 100,
        render: (_, record) => {
          if (isTablePlaceholderRow(record)) return null

          return (
            <Space size={4}>
              <Button
                type="text"
                icon={<EditOutlined style={{ color: '#595959' }} />}
                onClick={() => {
                  setEditingId(record.id)
                  setModalOpen(true)
                }}
              />
              <Button
                type="text"
                loading={deletingId === record.id}
                icon={<DeleteOutlined style={{ color: '#ff7875' }} />}
                onClick={() => confirmDelete(record.id)}
              />
            </Space>
          )
        },
      },
    ],
    [authorCatalog, confirmDelete, dateLocale, deletingId, lang, t, tagCatalog],
  )

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
            {t('posts.title')}
          </Typography.Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            {t('posts.newPost')}
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
            placeholder={t('posts.searchPlaceholder')}
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

        <div
          style={
            skipPlaceholdersOnFirstPage
              ? { minHeight: getPostsFirstPageMinHeight() }
              : undefined
          }
        >
          <Table<PostTableRow>
            columns={columns}
            dataSource={tableRows}
            loading={loading}
            pagination={false}
            onRow={(record) => ({
              className: isTablePlaceholderRow(record)
                ? 'table-row-placeholder'
                : undefined,
            })}
            locale={{
              emptyText: loading ? t('common.loading') : t('posts.noPosts'),
            }}
          />
        </div>

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
            {t('posts.count', { count: pagination.totalCount })}
          </Typography.Text>
          <Pagination
            current={pagination.currentPage}
            pageSize={pageSize}
            total={pagination.totalCount}
            onChange={(nextPage) => dispatch(postsActions.fetchRequest(nextPage))}
            showSizeChanger={false}
            disabled={loading}
          />
        </div>
      </div>

      <PostFormModal
        open={modalOpen}
        editingId={editingId}
        page={pagination.currentPage}
        onClose={closeModal}
      />
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
