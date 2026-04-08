import {
  useRef,
  useMemo,
  useEffect,
  forwardRef,
  // useCallback,
  // useImperativeHandle,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { CirclePlusIcon } from '@/components/icons'
import Button from '../Button'
import ImageCropper from '../ImageCropper'
import ImageUploaderGridItem from './ImageUploaderGridItem'
import { toast } from '@/components/ui/Toaster'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { Dialog } from '../Dialog'
import { cn } from '@/utils/dom'

const MAX_IMAGE = 10

const ImageUploader = forwardRef(
  (
    {
      label,
      error,
      value,
      helperText,
      defaultValue,
      maxSizeMB = 15,
      uploadRequest,
      downloadRequest,
      // uploadFileType,
      onUploadStateChange,
      onChange = () => {},
      previewRatio = 48 / 100,
      maxImageCount = MAX_IMAGE,
      accept = ['image/png', 'image/jpeg'],
      withCrop = false,
      multiple = false,
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useUncontrolled({
      value,
      onChange,
      defaultValue,
      finalValue: [],
    })

    const inputRef = useRef(null)
    const cropperRef = useRef(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [imageToCrop, setImageToCrop] = useState(null)
    const [originalFile, setOriginalFile] = useState(null)

    const handleImageChange = async () => {
      if (localValue.length >= maxImageCount) {
        toast.error(`حداکثر ${maxImageCount} تصویر قابل آپلود است`)
        return
      }

      const fileList = Array.from(inputRef.current.files)
      const remainingSlots = maxImageCount - localValue.length
      const filesToProcess = fileList.slice(0, remainingSlots)

      // If cropping is enabled, only process the first file
      if (withCrop && filesToProcess.length > 0) {
        const file = filesToProcess[0]
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد`)
          inputRef.current.value = null
          return
        }
        if (!accept.includes(file.type)) {
          toast.error(`فرمت فایل انتخابی نا معتبر است`)
          inputRef.current.value = null
          return
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          setOriginalFile(file)
          setImageToCrop(reader.result)
          setIsModalOpen(true)
        }
        inputRef.current.value = null
        return
      }

      const validFiles = []
      const invalidFiles = []

      filesToProcess.forEach((file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          invalidFiles.push(`${file.name}: حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد`)
          return
        }
        if (!accept.includes(file.type)) {
          invalidFiles.push(`${file.name}: فرمت فایل نا معتبر است`)
          return
        }
        validFiles.push(file)
      })

      if (invalidFiles.length > 0) {
        invalidFiles.forEach((errorMsg) => toast.error(errorMsg))
      }

      if (validFiles.length > 0) {
        setLocalValue([...localValue, ...validFiles])
        if (validFiles.length > 1) {
          toast.success(`${validFiles.length} تصویر با موفقیت اضافه شد`)
        }
      }

      inputRef.current.value = null
    }

    const handleCropDone = async () => {
      if (!cropperRef.current || !originalFile) return

      const { file } = await cropperRef.current.generateCroppedImage(
        originalFile.name,
        originalFile.type
      )

      setLocalValue([...localValue, file])
      setIsModalOpen(false)
    }

    const handleChangeFileItem = (index, v) =>
      setLocalValue((prev) => prev.map((f, i) => (i === index ? v : f)))

    const localHelperText = useMemo(() => {
      if (helperText !== undefined) return helperText

      return `* حجم تصویر حداکثر ${maxSizeMB} مگابایت و با فرمت ${accept.map((a) => a.replace('image/', '')).join(', ')} باشد.`
    }, [accept, helperText, maxSizeMB])

    const handleRemoveImage = (index) => {
      const newImages = [...localValue]
      newImages.splice(index, 1)
      setLocalValue(newImages)
    }

    const handleButtonClick = () => {
      inputRef.current.click()
    }

    // const getFiles = useCallback(() => localValue, [localValue])

    const uploadState = useMemo(() => {
      return localValue.some((f) => f.uploadState === 'loading')
        ? 'loading'
        : localValue.some((f) => f.uploadState === 'error' || !!f.error)
          ? 'error'
          : 'idle'
    }, [localValue])

    // useImperativeHandle(ref, () => ({ getFiles, uploadState }), [getFiles, uploadState])

    useEffect(() => {
      onUploadStateChange?.(uploadState)
    }, [uploadState, onUploadStateChange])

    return (
      <div ref={ref}>
        {label && (
          <label htmlFor="upload-image" className="block mb-1">
            {label}
          </label>
        )}

        <div className="gap-x-4 grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-y-5">
          {localValue.length < maxImageCount && (
            <div className="relative">
              <div style={{ paddingBottom: `${previewRatio * 100}%` }} />

              <input
                multiple={multiple}
                type="file"
                ref={inputRef}
                id="upload-image"
                className="hidden"
                onChange={handleImageChange}
                accept={accept.join(', ')}
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className={cn(
                  'absolute top-0 left-0 w-full h-full flex flex-col gap-3 justify-center items-center bg-gray-100 text-gray-400 px-4 py-2 rounded-lg mb-1 border-2 cursor-cell',
                  error ? ' border-rust-600' : ' border-gray-300'
                )}
              >
                <div className="flex items-center gap-1">
                  <CirclePlusIcon />
                  <p className="text-[10px]">{multiple ? 'بارگذاری تصاویر' : 'بارگذاری تصویر'}</p>
                </div>

                {multiple && (
                  <p className="text-[8px] text-gray-500">
                    {localValue.length}/{maxImageCount}
                  </p>
                )}
              </button>
            </div>
          )}

          {localValue.map((file, index) => (
            <ImageUploaderGridItem
              file={file}
              ratio={previewRatio}
              uploadRequest={uploadRequest}
              downloadRequest={downloadRequest}
              key={file.id || file.name || index}
              onRemove={() => handleRemoveImage(index)}
              onChange={(v) => handleChangeFileItem(index, v)}
            />
          ))}
        </div>

        <div className={`text-xs mt-1 text-[10px] ${error ? 'text-rust-600' : 'text-gray-400'}`}>
          {error || localHelperText}
        </div>

        <Dialog open={isModalOpen} onOpenChange={(s) => setIsModalOpen(s)}>
          {imageToCrop && (
            <>
              <ImageCropper
                ref={cropperRef}
                imageSrc={imageToCrop}
                minWidth={100}
                minHeight={100}
                ruleOfThirds
              />

              <div className="flex items-center gap-4 mt-4">
                <Button className="min-w-28" onClick={handleCropDone}>
                  تایید
                </Button>
                <Button
                  variant="outline"
                  className="min-w-28"
                  onClick={() => setIsModalOpen(false)}
                >
                  انصراف
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </div>
    )
  }
)

ImageUploader.displayName = 'ImageUploader'

ImageUploader.propTypes = {
  onUploadStateChange: PropTypes.func,
  uploadRequest: PropTypes.func,
  downloadRequest: PropTypes.func,
  label: PropTypes.string,
  helperText: PropTypes.string,
  maxImageCount: PropTypes.number,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  withCrop: PropTypes.bool,
  multiple: PropTypes.bool,
}
export default ImageUploader
