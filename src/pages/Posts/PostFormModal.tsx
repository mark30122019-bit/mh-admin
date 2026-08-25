import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { PostFormInput } from '@/api'
import {
  Button,
  Form,
  ImageCropModal,
  ImageUploadCard,
  Input,
  Modal,
  PostFormSkeleton,
  Select,
  message,
} from '@/components/ui'
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
import { FIELD_MAX_LENGTH, resolveInputMaxLength } from '@/utils/fieldMaxLength'
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

type CropDraft = {
  src: string
  fileName: string
}

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
  const [existingPreviewUrl, setExistingPreviewUrl] = useState<string | null>(
    null,
  )
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [cropDraft, setCropDraft] = useState<CropDraft | null>(null)
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
  const formBusy = detailLoading || referencesLoading
  const showSkeleton = Boolean(editingId) && detailLoading
  const watchedTitle = Form.useWatch('title', form)

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
    setExistingPreviewUrl(null)
    setPreviewError(null)
    setCropDraft((prev) => {
      if (prev) URL.revokeObjectURL(prev.src)
      return null
    })
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
    setExistingPreviewUrl(null)
    setPreviewError(t('posts.previewRequired'))
  }

  const closeCropDraft = () => {
    setCropDraft((prev) => {
      if (prev) URL.revokeObjectURL(prev.src)
      return null
    })
  }

  const handleSelectPreview = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setPreviewError(t('posts.selectImage'))
      return
    }
    const src = URL.createObjectURL(file)
    setCropDraft({ src, fileName: file.name })
  }

  const handleCropComplete = (file: File) => {
    setPreviewFile(file)
    setExistingPreviewUrl(null)
    setPreviewError(null)
    closeCropDraft()
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
    <>
      <Modal
        title={editingId ? t('posts.editPost') : t('posts.newPost')}
        open={open}
        onCancel={onClose}
        footer={null}
        width={780}
        destroyOnHidden
      >
        {showSkeleton ? (
          <PostFormSkeleton />
        ) : (
        <Form<PostFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={referencesLoading}
        >
          <div className="mb-1 flex items-start gap-6">
            <div className="min-w-0 flex-1">
              <Form.Item
                label={t('posts.postTitle')}
                name="title"
                rules={[{ required: true, message: t('posts.enterTitle') }]}
              >
                <Input
                  showCount
                  maxLength={resolveInputMaxLength(
                    FIELD_MAX_LENGTH.postTitle,
                    watchedTitle,
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t('posts.author')}
                name="authorId"
                rules={[{ required: true, message: t('posts.selectAuthor') }]}
                style={{ marginBottom: 0 }}
              >
                <Select
                  loading={referencesLoading}
                  options={authorSelectOptions}
                  placeholder={t('posts.selectAuthor')}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </div>

            <Form.Item
              label={t('posts.previewPicture')}
              required
              validateStatus={previewError ? 'error' : undefined}
              help={previewError ?? undefined}
              className="mb-0 shrink-0"
            >
              <div className="flex flex-col items-stretch gap-2">
                <ImageUploadCard
                  variant="banner"
                  imageUrl={previewUrl}
                  replaceLabel={t('posts.replacePreview')}
                  emptyLabel={t('posts.previewHint')}
                  disabled={formBusy}
                  hasError={Boolean(previewError)}
                  onSelect={handleSelectPreview}
                />
                {previewUrl ? (
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={clearPreview}
                    style={{ padding: 0, height: 'auto', alignSelf: 'flex-start' }}
                  >
                    {t('posts.removePreview')}
                  </Button>
                ) : null}
              </div>
            </Form.Item>
          </div>

          <Form.Item label={t('posts.tags')} name="tagIds" className="mt-4">
            <Select
              mode="multiple"
              loading={referencesLoading}
              options={tagSelectOptions}
              placeholder={t('posts.selectTags')}
            />
          </Form.Item>

          <Form.Item
            label={t('posts.text')}
            name="text"
            required
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

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              {t('common.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              disabled={!hasPreview || formBusy}
            >
              {t('common.save')}
            </Button>
          </Form.Item>
        </Form>
        )}
      </Modal>

      <ImageCropModal
        open={Boolean(cropDraft)}
        imageSrc={cropDraft?.src ?? null}
        fileName={cropDraft?.fileName ?? 'preview.jpg'}
        aspect={16 / 9}
        cropShape="rect"
        onCancel={closeCropDraft}
        onComplete={handleCropComplete}
      />
    </>
  )
}
