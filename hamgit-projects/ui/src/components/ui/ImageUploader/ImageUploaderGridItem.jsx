/* eslint-disable @next/next/no-img-element */
import { cn } from '@/utils/dom'
import Popover from '../popover'
import { CircleLoadingIcon, CloseIcon, InfoIcon } from '@/components/icons'
import withUploaderItem from './with-uploader-item'

function ImageUploaderGridItem({ file, className, ratio, src, loading, onFileLoad, onRemove }) {
  return (
    <div className={cn('relative', className)}>
      <div style={{ paddingBottom: `${ratio * 100}%` }} />
      <img
        src={src}
        alt={file.name}
        onLoad={onFileLoad}
        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg bg-gray-200"
      />

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
          <CircleLoadingIcon size={36} className="animate-spin text-gray-300" />
        </div>
      )}

      {file.uploadState === 'loading' && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
          <CircleLoadingIcon size={36} className="animate-spin text-teal-600" />
        </div>
      )}

      {file.uploadState === 'error' && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
          <Popover>
            <Popover.Trigger>
              <InfoIcon size={36} className="text-yellow-600" />
            </Popover.Trigger>

            <Popover.Content className="text-center text-yellow-600 text-sm">
              {file.error?.message || 'آپلود فایل با خطا مواجه شد'}
            </Popover.Content>
          </Popover>
        </div>
      )}

      {onRemove && (
        <button
          type="button"
          aria-label="remove"
          onClick={onRemove}
          className="absolute -top-3 right-0.5 bg-red-100 text-red-600 p-1 rounded-full border-2 border-white"
        >
          <CloseIcon size={14} />
        </button>
      )}
    </div>
  )
}

export default withUploaderItem(ImageUploaderGridItem)
