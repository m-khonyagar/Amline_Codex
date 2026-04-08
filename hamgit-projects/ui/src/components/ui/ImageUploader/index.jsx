/* eslint-disable no-nested-ternary */
/* eslint-disable @next/next/no-img-element */
import React, { useRef, useMemo, useEffect, forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../Modal'
import Button from '../Button'
import ImageCropper from '../ImageCropper'
import ImageUploaderGridItem from './ImageUploaderGridItem'
import { toast } from '@/components/ui/Toaster'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import { isWebView, pickAndUploadFile } from '@/utils/webview'
import { CirclePlusIcon } from '@/components/icons'

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
      uploadFileType,
      onUploadStateChange,
      onChange = () => {},
      previewRatio = 48 / 100,
      maxImageCount = MAX_IMAGE,
      accept = ['image/png', 'image/jpeg'],
      withCrop = false,
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useUncontrolled({
      value: value || defaultValue,
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
      if (localValue.length > maxImageCount) {
        return
      }

      const fileList = Array.from(inputRef.current.files).slice(
        0,
        maxImageCount - localValue.length
      )

      fileList.forEach(async (file) => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد`)
          return
        }

        if (!accept.includes(file.type)) {
          toast.error(`فرمت فایل انتخابی نا معتبر است`)
          return
        }

        if (withCrop) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
            setOriginalFile(file)
            setImageToCrop(reader.result)
            setIsModalOpen(true)
          }
        } else setLocalValue([...localValue, ...fileList])
      })

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

    const handleChangeFileItem = (index, v) => {
      setLocalValue(localValue.map((f, i) => (i === index ? v : f)))
    }

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

    const handleInputClick = (e) => {
      const isInWebView = isWebView()

      if (isInWebView) {
        e.preventDefault()

        const cb = (files) => {
          const successFiles = files
            .filter((f) => f.status)
            .map((f) => {
              const response = JSON.parse(f.response)

              return { id: response?.id }
            })

          setLocalValue([...localValue, ...successFiles])
        }

        pickAndUploadFile(uploadFileType, cb, {
          accept,
          maxCount: maxImageCount,
          maxSizeB: maxSizeMB * 1024 * 1024,
        })
      }
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
      <div>
        {label && (
          <label htmlFor="upload-image" className="block mb-3">
            {label}
          </label>
        )}

        <div className="grid grid-cols-2 gap-x-2 gap-y-5" ref={ref}>
          {localValue.length < maxImageCount && (
            <div className="relative">
              <div style={{ paddingBottom: `${previewRatio * 100}%` }} />

              <input
                multiple={false}
                type="file"
                ref={inputRef}
                id="upload-image"
                className="hidden"
                onChange={handleImageChange}
                accept={accept.join(', ')}
                onClick={(e) => handleInputClick(e)}
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className={`absolute top-0 left-0 w-full h-full flex flex-col justify-evenly
               items-center bg-gray-400 text-gray-300 px-4 py-2
               rounded-lg mb-1 border-2 ${error ? ' border-rust-600' : ' border-gray-200'}
               cursor-cell`}
              >
                <CirclePlusIcon />
                <p className="text-[10px]">بارگذاری تصاویر</p>
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

        <div className={`text-xs mt-1 text-[10px] ${error ? 'text-rust-600' : 'text-gray-300'}`}>
          {error || localHelperText}
        </div>

        <Modal className="max-w-xl w-[95%]" open={isModalOpen}>
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
        </Modal>
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
}
export default ImageUploader
