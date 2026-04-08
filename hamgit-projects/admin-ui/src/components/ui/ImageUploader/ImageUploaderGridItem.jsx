import { cn } from '@/utils/dom'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import withUploaderItem from './with-uploader-item'
import { CircleLoadingIcon } from '@/components/icons'

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
          <CircleLoadingIcon size={36} className="animate-spin text-gray-300" />
        </div>
      )}

      {file.uploadState === 'error' && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
          <InformationCircleIcon size={36} className="text-yellow-600" />
          <div className="text-center text-yellow-600 text-sm">
            {file.error?.message || 'آپلود فایل با خطا مواجه شد'}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="remove"
        onClick={onRemove}
        className="absolute -top-3 right-0.5 bg-red-100 text-red-600 p-1 rounded-full border-2 border-white"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </div>
  )
}

const EnhancedImageUploaderGridItem = withUploaderItem(ImageUploaderGridItem)
export default EnhancedImageUploaderGridItem
