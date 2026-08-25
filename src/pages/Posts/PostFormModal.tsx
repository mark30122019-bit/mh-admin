import { UploadOutlined } from '@ant-design/icons'
import { Image, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { PostFormInput } from '@/api'
import { Button, Form, Input, Modal, Select, message } from '@/components/ui'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
import { useTranslation } from '@/hooks/useTranslation'
import { postsActions } from '@/modules/posts/actions'
import {
  RichTextEditor,
  isRichTextEmpty,
} from '@/modules/posts/components/RichTextEditor'
import type { PostsModuleState } from '@/modules/posts/posts.module'
import {
  selectPostDetail,
  selectPostDetailLoading,
  selectPostsAuthorOptions,
  selectPostsReferencesLoading,
  selectPostsSaveError,
  selectPostsSaveFieldErrors,
  selectPostsSaving,
  selectPostsTagOptions,
} from '@/modules/posts/selectors'
import { idsEqual, toEntityId } from '@/utils/entityId'
import { formatDeletedEntityLabel, formatAuthorDisplayName } from '@/utils/orphanLabels'

type PostFormValues = {
  title: string
  authorId: number
  tagIds: number[]
  text: string
}

type PostFormModalProps = {
  open: boolean
  editingId: number | null
  page: number
  onClose: () => void
}

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

export function PostFormModal({
  open,
  editingId,
  page,
  onClose,
}: PostFormModalProps) {
  const dispatch = useDispatch()
  const { t, lang } = useTranslation()
  const [form] = Form.useForm<PostFormValues>()
  const [previewFile, setPreviewFile] = useState<File | undefined>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [existingPreviewUrl, setExistingPreviewUrl] = useState<string | null>(
    null,
  )
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const wasSavingRef = useRef(false)

  const detail = useSelector((state: PostsModuleState) => selectPostDetail(state))
  const detailLoading = useSelector((state: PostsModuleState) =>
    selectPostDetailLoading(state),
  )
  const saving = useSelector((state: PostsModuleState) => selectPostsSaving(state))
  const saveError = useSelector((state: PostsModuleState) =>
    selectPostsSaveError(state),
  )
  const saveFieldErrors = useSelector((state: PostsModuleState) =>
    selectPostsSaveFieldErrors(state),
  )
  const formFieldErrors = saveFieldErrors.map((error) =>
    error.field === 'code' ? { ...error, field: 'title' } : error,
  )
  const authorOptions = useSelector((state: PostsModuleState) =>
    selectPostsAuthorOptions(state),
  )
  const tagOptions = useSelector((state: PostsModuleState) =>
    selectPostsTagOptions(state),
  )
  const referencesLoading = useSelector((state: PostsModuleState) =>
    selectPostsReferencesLoading(state),
  )

  const previewUrl = localPreviewUrl ?? existingPreviewUrl
  const hasPreview = Boolean(previewFile || existingPreviewUrl)

  const authorSelectOptions = useMemo(() => {
    const options = authorOptions.map((author) => ({
      value: toEntityId(author.id) ?? author.id,
      label: formatAuthorDisplayName(author),
    }))

    const orphanAuthorId = toEntityId(detail?.author?.id)
    if (
      orphanAuthorId != null &&
      !authorOptions.some((author) => idsEqual(author.id, orphanAuthorId))
    ) {
      options.unshift({
        value: orphanAuthorId,
        label: formatDeletedEntityLabel(orphanAuthorId, lang),
      })
    }

    return options
  }, [authorOptions, detail?.author?.id, lang])

  const tagSelectOptions = useMemo(
    () =>
      tagOptions.map((tag) => ({
        value: toEntityId(tag.id) ?? tag.id,
        label: tag.name,
      })),
    [tagOptions],
  )

  useFormApiErrors(form, formFieldErrors, saveError, 'Post')

  useEffect(() => {
    if (!previewFile) {
      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      return
    }

    const url = URL.createObjectURL(previewFile)
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [previewFile])

  useEffect(() => {
    if (!open) return
    dispatch(postsActions.referencesRequest())
  }, [dispatch, open])

  useEffect(() => {
    if (!open) return

    if (editingId) {
      dispatch(postsActions.detailRequest(editingId))
      return
    }

    dispatch(postsActions.detailClear())
    form.resetFields()
    setPreviewFile(undefined)
    setFileList([])
    setExistingPreviewUrl(null)
    setPreviewError(null)
  }, [dispatch, editingId, form, open])

  useEffect(() => {
    if (!open || !editingId || !detail) return

    form.setFieldsValue({
      title: detail.title,
      authorId: toEntityId(detail.author?.id) ?? undefined,
      tagIds: (detail.tags ?? [])
        .map((tag) => toEntityId(tag.id))
        .filter((id): id is number => id != null),
      text: detail.text,
    })
    setPreviewFile(undefined)
    setFileList([])
    setExistingPreviewUrl(detail.previewPicture?.url ?? null)
    setPreviewError(
      detail.previewPicture?.url ? null : t('posts.previewRequired'),
    )
  }, [detail, editingId, form, open, t])

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? t('posts.updated') : t('posts.created'))
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving, t])

  const clearPreview = () => {
    setPreviewFile(undefined)
    setFileList([])
    setExistingPreviewUrl(null)
    setPreviewError(t('posts.previewRequired'))
  }

  const handleSubmit = (values: PostFormValues) => {
    if (!hasPreview) {
      setPreviewError(t('posts.previewRequired'))
      return
    }

    const payload: PostFormInput = {
      title: values.title,
      authorId: values.authorId,
      tagIds: values.tagIds ?? [],
      text: values.text,
      previewPicture: previewFile,
    }

    dispatch(postsActions.saveRequest(payload, page, editingId ?? undefined))
  }

  return (
    <Modal
      title={editingId ? t('posts.editPost') : t('posts.newPost')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnHidden
    >
      <Form<PostFormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={detailLoading || referencesLoading}
      >
        <Form.Item
          label={t('posts.postTitle')}
          name="title"
          rules={[{ required: true, message: t('posts.enterTitle') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('posts.author')}
          name="authorId"
          rules={[{ required: true, message: t('posts.selectAuthor') }]}
        >
          <Select
            loading={referencesLoading}
            options={authorSelectOptions}
            placeholder={t('posts.selectAuthor')}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item label={t('posts.tags')} name="tagIds">
          <Select
            mode="multiple"
            loading={referencesLoading}
            options={tagSelectOptions}
            placeholder={t('posts.selectTags')}
            // Удалённые теги без option отобразятся как ID —
            // админ может снять их крестиком перед сохранением.
          />
        </Form.Item>

        <Form.Item
          label={t('posts.text')}
          name="text"
          rules={[
            {
              validator: (_, value: string) =>
                isRichTextEmpty(value)
                  ? Promise.reject(new Error(t('posts.enterText')))
                  : Promise.resolve(),
            },
          ]}
          trigger="onChange"
          validateTrigger="onChange"
        >
          <RichTextEditor />
        </Form.Item>

        <Form.Item
          label={t('posts.previewPicture')}
          required
          validateStatus={previewError ? 'error' : undefined}
          help={previewError ?? undefined}
        >
          <Upload
            accept={IMAGE_ACCEPT}
            beforeUpload={(file) => {
              if (!file.type.startsWith('image/')) {
                setPreviewError(t('posts.selectImage'))
                return Upload.LIST_IGNORE
              }

              setPreviewFile(file)
              setExistingPreviewUrl(null)
              setPreviewError(null)
              setFileList([
                {
                  uid: `-preview-${Date.now()}`,
                  name: file.name,
                  status: 'done',
                  originFileObj: file,
                },
              ])
              return false
            }}
            onRemove={() => {
              clearPreview()
              return true
            }}
            fileList={fileList}
            maxCount={1}
            listType="picture"
            showUploadList={{ showPreviewIcon: false }}
          >
            <Button icon={<UploadOutlined />}>{t('posts.selectFile')}</Button>
          </Upload>

          {previewUrl ? (
            <div style={{ marginTop: 12 }}>
              <Image
                src={previewUrl}
                alt="Post preview"
                width={240}
                style={{
                  borderRadius: 8,
                  objectFit: 'cover',
                  maxHeight: 160,
                }}
              />
              <div style={{ marginTop: 8 }}>
                <Button
                  type="link"
                  danger
                  onClick={clearPreview}
                  style={{ padding: 0 }}
                >
                  {t('posts.removePreview')}
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{ marginTop: 8, color: 'rgba(0, 0, 0, 0.45)', fontSize: 13 }}
            >
              {t('posts.previewHint')}
            </div>
          )}
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {t('common.cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            disabled={!hasPreview || detailLoading || referencesLoading}
          >
            {t('common.save')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
