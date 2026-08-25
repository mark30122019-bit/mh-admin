import { Slider } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Button, Modal } from '@/components/ui'
import { useTranslation } from '@/hooks/useTranslation'
import { getCroppedImageFile } from '@/utils/cropImage'

type ImageCropModalProps = {
  open: boolean
  imageSrc: string | null
  fileName: string
  /** 1 — круглый аватар; 16/9 — баннер превью */
  aspect: number
  cropShape?: 'rect' | 'round'
  onCancel: () => void
  onComplete: (file: File) => void
}

export function ImageCropModal({
  open,
  imageSrc,
  fileName,
  aspect,
  cropShape = 'rect',
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const { t } = useTranslation()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!open) return
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setApplying(false)
  }, [open, imageSrc])

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setApplying(true)
    try {
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName,
        'image/jpeg',
      )
      onComplete(file)
    } catch {
      setApplying(false)
    }
  }

  return (
    <Modal
      title={t('common.cropImage')}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={560}
      destroyOnHidden
      zIndex={1100}
    >
      <div className="relative h-[320px] w-full overflow-hidden rounded-lg bg-[#111]">
        {imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        ) : null}
      </div>

      <div className="mt-4 px-1">
        <div className="mb-1 text-sm text-black/65">{t('common.zoom')}</div>
        <Slider
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(value) => setZoom(value)}
          tooltip={{ formatter: null }}
        />
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button onClick={onCancel} disabled={applying}>
          {t('common.cancel')}
        </Button>
        <Button
          type="primary"
          loading={applying}
          disabled={!croppedAreaPixels}
          onClick={() => {
            void handleApply()
          }}
        >
          {t('common.apply')}
        </Button>
      </div>
    </Modal>
  )
}
