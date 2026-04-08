import { CircleLoadingIcon } from '@/components/icons'
import { cn } from '@/utils/dom'
import { useCallback, useEffect, useState } from 'react'
import { Dialog } from '../Dialog'

const ImagePreview = ({ file, downloadRequest, className, ratio = 48 / 100 }) => {
  const [loading, setLoading] = useState(true)
  const [src, setSrc] = useState(null)
  const [isOpenPreview, setIsOpenPreview] = useState(false)

  const downloadFile = useCallback(async () => {
    if (file.url) {
      setSrc(file.url)
      setLoading(false)
      return
    }

    if (file instanceof File) {
      try {
        setSrc(URL.createObjectURL(file))
      } catch (er) {
        console.error(er)
      } finally {
        setLoading(false)
      }

      return
    }

    if (file.id) {
      try {
        const response = await downloadRequest(file.id)
        setSrc(URL.createObjectURL(response))
      } catch (er) {
        console.error(er)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const onFileLoad = () => {
    if (file instanceof File) {
      URL.revokeObjectURL(src)
    }
  }

  useEffect(() => {
    downloadFile()
  }, [downloadFile])

  return (
    <div className={cn('relative', className)}>
      <div style={{ paddingBottom: `${ratio * 100}%` }} />

      <img
        src={src}
        alt={file.name}
        onLoad={onFileLoad}
        onClick={() => setIsOpenPreview(true)}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg bg-gray-200 cursor-pointer"
      />

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
          <CircleLoadingIcon size={24} className="animate-spin text-gray-300" />
        </div>
      )}

      <Dialog open={isOpenPreview} onOpenChange={(s) => setIsOpenPreview(s)}>
        <div className={cn('relative h-[70vh]')}>
          <div style={{ paddingBottom: `${ratio * 100}%` }} />
          <img
            src={src}
            alt={file.name}
            onLoad={onFileLoad}
            className="absolute top-0 left-0 w-full h-full object-contain rounded-lg bg-gray-200"
          />
        </div>
      </Dialog>
    </div>
  )
}

export default ImagePreview
