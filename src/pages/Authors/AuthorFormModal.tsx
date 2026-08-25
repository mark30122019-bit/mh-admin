import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AuthorFormPayload } from '@/api'
import {
  AuthorFormSkeleton,
  Button,
  Form,
  ImageCropModal,
  ImageUploadCard,
  Input,
  Modal,
  message,
} from '@/components/ui'
import { useEditFormReveal } from '@/hooks/useEditFormReveal'
import { useFormApiErrors } from '@/hooks/useFormApiErrors'
import { useTranslation } from '@/hooks/useTranslation'
import { authorsActions } from '@/modules/authors/actions'
import type { AuthorsModuleState } from '@/modules/authors/authors.module'
import {
  selectAuthorDetail,
  selectAuthorDetailLoading,
  selectAuthorsSaveError,
  selectAuthorsSaveFieldErrors,
  selectAuthorsSaving,
} from '@/modules/authors/selectors'
import { getAuthorInitials } from '@/utils/authorInitials'
import { FIELD_MAX_LENGTH, resolveInputMaxLength } from '@/utils/fieldMaxLength'

type AuthorFormValues = {
  name: string
  lastName: string
  secondName?: string
  shortDescription?: string
  description?: string
}

type AuthorFormModalProps = {
  open: boolean
  editingId: number | null
  onClose: () => void
}

type CropDraft = {
  src: string
  fileName: string
}

export function AuthorFormModal({
  open,
  editingId,
  onClose,
}: AuthorFormModalProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm<AuthorFormValues>()
  const [avatarFile, setAvatarFile] = useState<File | undefined>()
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null)
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [cropDraft, setCropDraft] = useState<CropDraft | null>(null)
  const wasSavingRef = useRef(false)

  const detail = useSelector((state: AuthorsModuleState) =>
    selectAuthorDetail(state),
  )
  const detailLoading = useSelector((state: AuthorsModuleState) =>
    selectAuthorDetailLoading(state),
  )
  const saving = useSelector((state: AuthorsModuleState) =>
    selectAuthorsSaving(state),
  )
  const saveError = useSelector((state: AuthorsModuleState) =>
    selectAuthorsSaveError(state),
  )
  const saveFieldErrors = useSelector((state: AuthorsModuleState) =>
    selectAuthorsSaveFieldErrors(state),
  )

  useFormApiErrors(form, saveFieldErrors, saveError, 'Author')

  const avatarUrl = localAvatarUrl ?? (removeAvatar ? null : existingAvatarUrl)
  const watchedName = Form.useWatch('name', form)
  const watchedLastName = Form.useWatch('lastName', form)
  const watchedSecondName = Form.useWatch('secondName', form)
  const watchedShortDescription = Form.useWatch('shortDescription', form)
  const watchedDescription = Form.useWatch('description', form)
  const [shortViewport, setShortViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-height: 799px)').matches,
  )
  const avatarInitials = useMemo(
    () => getAuthorInitials(watchedName, watchedLastName),
    [watchedName, watchedLastName],
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-height: 799px)')
    const apply = () => setShortViewport(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!avatarFile) {
      setLocalAvatarUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      return
    }

    const url = URL.createObjectURL(avatarFile)
    setLocalAvatarUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [avatarFile])

  useEffect(() => {
    if (!open) return

    if (editingId) {
      dispatch(authorsActions.detailRequest(editingId))
      return
    }

    dispatch(authorsActions.detailClear())
    form.resetFields()
    setAvatarFile(undefined)
    setExistingAvatarUrl(null)
    setRemoveAvatar(false)
    setCropDraft((prev) => {
      if (prev) URL.revokeObjectURL(prev.src)
      return null
    })
  }, [dispatch, editingId, form, open])

  const hydrateAuthorForm = useCallback(() => {
    if (!detail) return

    form.setFieldsValue({
      name: detail.name,
      lastName: detail.lastName,
      secondName: detail.secondName,
      shortDescription: detail.shortDescription,
      description: detail.description,
    })
    setAvatarFile(undefined)
    setExistingAvatarUrl(detail.avatar?.url ?? null)
    setRemoveAvatar(false)
  }, [detail, form])

  const showSkeleton = useEditFormReveal({
    open,
    editingId,
    detailLoading,
    detailReady: Boolean(detail),
    hydrate: hydrateAuthorForm,
  })

  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      message.success(editingId ? t('authors.updated') : t('authors.created'))
      onClose()
    }
    wasSavingRef.current = saving
  }, [editingId, onClose, saveError, saving, t])

  const clearAvatar = () => {
    setAvatarFile(undefined)
    if (existingAvatarUrl) {
      setRemoveAvatar(true)
    }
    setExistingAvatarUrl(null)
  }

  const closeCropDraft = () => {
    setCropDraft((prev) => {
      if (prev) URL.revokeObjectURL(prev.src)
      return null
    })
  }

  const handleSelectAvatar = (file: File) => {
    const src = URL.createObjectURL(file)
    setCropDraft({ src, fileName: file.name })
  }

  const handleCropComplete = (file: File) => {
    setAvatarFile(file)
    setRemoveAvatar(false)
    closeCropDraft()
  }

  const handleSubmit = (values: AuthorFormValues) => {
    const payload: AuthorFormPayload = {
      name: values.name,
      lastName: values.lastName,
      secondName: values.secondName,
      shortDescription: values.shortDescription,
      description: values.description,
      avatar: avatarFile,
      removeAvatar: removeAvatar && !avatarFile,
    }

    dispatch(authorsActions.saveRequest(payload, editingId ?? undefined))
  }

  return (
    <>
      <Modal
        title={editingId ? t('authors.editAuthor') : t('authors.newAuthor')}
        open={open}
        onCancel={onClose}
        footer={null}
        width={680}
        destroyOnHidden
      >
        {showSkeleton ? (
          <AuthorFormSkeleton />
        ) : (
        <Form<AuthorFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div className="mb-1 flex items-center gap-6">
            <div className="min-w-0 flex-1">
              <Form.Item
                label={t('authors.name')}
                name="name"
                rules={[{ required: true, message: t('authors.enterName') }]}
              >
                <Input
                  showCount
                  maxLength={resolveInputMaxLength(
                    FIELD_MAX_LENGTH.authorName,
                    watchedName,
                  )}
                />
              </Form.Item>

              <Form.Item
                label={t('authors.lastName')}
                name="lastName"
                rules={[{ required: true, message: t('authors.enterLastName') }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  showCount
                  maxLength={resolveInputMaxLength(
                    FIELD_MAX_LENGTH.authorLastName,
                    watchedLastName,
                  )}
                />
              </Form.Item>
            </div>

            <Form.Item
              label={t('authors.avatar')}
              className="mb-0 shrink-0 [&_.ant-form-item-label]:w-full [&_.ant-form-item-label>label]:w-full [&_.ant-form-item-label>label]:justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <ImageUploadCard
                  variant="avatar"
                  imageUrl={avatarUrl}
                  initials={avatarInitials}
                  replaceLabel={t('authors.replaceAvatar')}
                  onSelect={handleSelectAvatar}
                />
                {avatarUrl ? (
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={clearAvatar}
                    style={{ padding: 0, height: 'auto' }}
                  >
                    {t('authors.removeAvatar')}
                  </Button>
                ) : null}
              </div>
            </Form.Item>
          </div>

          <Form.Item label={t('authors.secondName')} name="secondName" className="mt-4">
            <Input
              showCount
              maxLength={resolveInputMaxLength(
                FIELD_MAX_LENGTH.authorSecondName,
                watchedSecondName,
              )}
            />
          </Form.Item>

          <Form.Item label={t('authors.shortDescription')} name="shortDescription">
            <Input.TextArea
              autoSize={{ minRows: 2, maxRows: 4 }}
              showCount
              maxLength={resolveInputMaxLength(
                FIELD_MAX_LENGTH.authorShortDescription,
                watchedShortDescription,
              )}
            />
          </Form.Item>

          <Form.Item label={t('authors.description')} name="description">
            <Input.TextArea
              className="form-textarea-lg"
              autoSize={
                shortViewport
                  ? { minRows: 2, maxRows: 6 }
                  : { minRows: 4, maxRows: 8 }
              }
              showCount
              maxLength={resolveInputMaxLength(
                FIELD_MAX_LENGTH.authorDescription,
                watchedDescription,
              )}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              {t('common.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {t('common.save')}
            </Button>
          </Form.Item>
        </Form>
        )}
      </Modal>

      <ImageCropModal
        open={Boolean(cropDraft)}
        imageSrc={cropDraft?.src ?? null}
        fileName={cropDraft?.fileName ?? 'avatar.jpg'}
        aspect={1}
        cropShape="round"
        onCancel={closeCropDraft}
        onComplete={handleCropComplete}
      />
    </>
  )
}
