import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { PostFormInput } from '@/api'
import {
  Button,
  Form,
  FormBannerSkeleton,
  FormInputSkeleton,
  FormRichTextSkeleton,
  ImageCropModal,
  ImageUploadCard,
  Input,
  Modal,
  Select,
  message,
  notification,
} from '@/components/ui'
import { useEditFormReveal } from '@/hooks/useEditFormReveal'
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
  selectPostDetailError,
  selectPostDetailLoading,
  selectPostsAuthorOptions,
  selectPostsReferencesError,
  selectPostsReferencesLoading,
  selectPostsSaveError,
  selectPostsSaveFieldErrors,
  selectPostsSaving,
  selectPostsTagOptions,
} from '@/modules/posts/selectors'
import { toEntityId } from '@/utils/entityId'
import { FIELD_MAX_LENGTH, resolveInputMaxLength } from '@/utils/fieldMaxLength'
import { formatAuthorDisplayName } from '@/utils/orphanLabels'

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
  const { t } = useTranslation()
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
  const detailError = useSelector((state: PostsModuleState) =>
    selectPostDetailError(state),
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
  const referencesError = useSelector((state: PostsModuleState) =>
    selectPostsReferencesError(state),
  )

  const previewUrl = localPreviewUrl ?? existingPreviewUrl
  const hasPreview = Boolean(previewFile || existingPreviewUrl)
  const watchedTitle = Form.useWatch('title', form)

  const authorSelectOptions = useMemo(
    () =>
      authorOptions.map((author) => ({
        value: toEntityId(author.id) ?? author.id,
        label: formatAuthorDisplayName(author),
      })),
    [authorOptions],
  )

  const tagSelectOptions = useMemo(
    () =>
      tagOptions.map((tag) => ({
        value: toEntityId(tag.id) ?? tag.id,
        label: tag.name,
      })),
    [tagOptions],
  )

  useFormApiErrors(form, formFieldErrors, saveError, t('posts.saveFailed'))

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

  const hydratePostForm = useCallback(() => {
    if (!detail) return

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
  }, [detail, form, t])

  const showSkeleton = useEditFormReveal({
    open,
    editingId,
    detailLoading,
    detailReady: Boolean(detail),
    extraPending: referencesLoading,
    failed: Boolean(detailError),
    hydrate: hydratePostForm,
  })

  useEffect(() => {
    if (!open || !editingId || !detailError) return
    notification.error({
      message: t('posts.loadDetailFailed'),
      description: detailError,
    })
    onClose()
  }, [detailError, editingId, onClose, open, t])

  const notifiedReferencesErrorRef = useRef<string | null>(null)
  useEffect(() => {
    if (!open) {
      notifiedReferencesErrorRef.current = null
      return
    }
    if (
      !referencesError ||
      referencesError === notifiedReferencesErrorRef.current
    ) {
      return
    }
    notifiedReferencesErrorRef.current = referencesError
    notification.error({
      message: t('posts.loadReferencesFailed'),
      description: referencesError,
    })
  }, [open, referencesError, t])

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
        <Form<PostFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="mb-1 flex items-start gap-6">
            <div className="min-w-0 flex-1">
              <Form.Item
                label={t('posts.postTitle')}
                required
                {...(showSkeleton
                  ? {}
                  : {
                      name: 'title' as const,
                      rules: [
                        { required: true, message: t('posts.enterTitle') },
                      ],
                    })}
              >
                {showSkeleton ? (
                  <FormInputSkeleton />
                ) : (
                  <Input
                    showCount
                    maxLength={resolveInputMaxLength(
                      FIELD_MAX_LENGTH.postTitle,
                      watchedTitle,
                    )}
                  />
                )}
              </Form.Item>

              <Form.Item
                label={t('posts.author')}
                required
                style={{ marginBottom: 0 }}
                {...(showSkeleton
                  ? {}
                  : {
                      name: 'authorId' as const,
                      rules: [
                        {
                          required: true,
                          message: t('posts.selectAuthor'),
                        },
                      ],
                    })}
              >
                {showSkeleton ? (
                  <FormInputSkeleton />
                ) : (
                  <Select
                    loading={referencesLoading}
                    options={authorSelectOptions}
                    placeholder={t('posts.selectAuthor')}
                    showSearch
                    optionFilterProp="label"
                  />
                )}
              </Form.Item>
            </div>

            <Form.Item
              label={t('posts.previewPicture')}
              required
              validateStatus={
                !showSkeleton && previewError ? 'error' : undefined
              }
              help={!showSkeleton ? (previewError ?? undefined) : undefined}
              className="mb-0 shrink-0"
            >
              <div className="flex flex-col items-stretch gap-2">
                {showSkeleton ? (
                  <FormBannerSkeleton />
                ) : (
                  <ImageUploadCard
                    variant="banner"
                    imageUrl={previewUrl}
                    replaceLabel={t('posts.replacePreview')}
                    emptyLabel={t('posts.previewHint')}
                    hasError={Boolean(previewError)}
                    onSelect={handleSelectPreview}
                  />
                )}
                {!showSkeleton && previewUrl ? (
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={clearPreview}
                    style={{
                      padding: 0,
                      height: 'auto',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {t('posts.removePreview')}
                  </Button>
                ) : null}
              </div>
            </Form.Item>
          </div>

          <Form.Item
            label={t('posts.tags')}
            className="mt-4"
            {...(showSkeleton ? {} : { name: 'tagIds' as const })}
          >
            {showSkeleton ? (
              <FormInputSkeleton />
            ) : (
              <Select
                mode="multiple"
                loading={referencesLoading}
                options={tagSelectOptions}
                placeholder={t('posts.selectTags')}
              />
            )}
          </Form.Item>

          <Form.Item
            label={t('posts.text')}
            required
            {...(showSkeleton
              ? {}
              : {
                  name: 'text' as const,
                  rules: [
                    {
                      validator: (_: unknown, value: string) =>
                        isRichTextEmpty(value)
                          ? Promise.reject(new Error(t('posts.enterText')))
                          : Promise.resolve(),
                    },
                  ],
                  trigger: 'onChange' as const,
                  validateTrigger: 'onChange' as const,
                })}
          >
            {showSkeleton ? (
              <FormRichTextSkeleton editorHeight={200} />
            ) : (
              <RichTextEditor />
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
              disabled={
                showSkeleton ||
                !hasPreview ||
                referencesLoading ||
                detailLoading
              }
            >
              {t('common.save')}
            </Button>
          </Form.Item>
        </Form>
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
