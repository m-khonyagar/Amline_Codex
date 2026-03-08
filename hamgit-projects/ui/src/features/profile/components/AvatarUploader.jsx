import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import ImageCropper from '@/components/ui/ImageCropper'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { useUploadFile } from '@/features/common'
import { useAuthContext } from '@/features/auth'
import useDeleteUserAvatar from '../api/delete-user-avatar'
import { FileTypeEnums } from '@/data/enums/file_type_enums'
import { useUncontrolled } from '@/hooks/use-uncontrolled'
import Popover from '@/components/ui/popover'
import { cn } from '@/utils/dom'
import {
  CircleCloseIcon,
  CircleLoadingIcon,
  CirclePlusIcon,
  InfoIcon,
  PencilIcon,
  UserIcon,
} from '@/components/icons'
import { isWebView, pickAndUploadFile } from '@/utils/webview'
import { handleErrorOnSubmit } from '@/utils/error'

const maxSizeMB = 1
const previewRatio = 1
const accept = ['image/png', 'image/jpeg']

function AvatarUploader({ onDone, onUploadStateChange, avatar, withCrop = false }) {
  const { currentUser } = useAuthContext()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const inputRef = useRef(null)
  const cropperRef = useRef(null)
  const abortRef = useRef()

  const [uploadState, setUploadState] = useState('')
  const [stateError, setStateError] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)

  const [localValue, setLocalValue] = useUncontrolled({
    defaultValue: avatar,
    finalValue: [],
  })

  const uploadMutation = useUploadFile({
    fileType: FileTypeEnums.AVATAR,
  })

  const { mutate: deleteUserAvatar, isPending: isDeletePending } = useDeleteUserAvatar({
    onSuccess: ({ data }) => {
      toast.success(data.message)
    },
    onError: (err) => {
      handleErrorOnSubmit(err)
    },
  })

  const upload = async (file) => {
    if (['loading', 'success'].includes(stateError)) {
      return
    }

    const clone = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    })

    try {
      setUploadState('loading')

      abortRef.current = new AbortController()
      const response = await uploadMutation.mutateAsync({
        file: clone,
        signal: abortRef.current.signal,
      })
      setUploadState('success')

      onDone?.(response?.data?.id || 0)
    } catch (error) {
      setUploadState('error')
      setStateError(error)
    }
  }

  const handleInputChange = () => {
    const file = inputRef.current.files[0]

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`حجم فایل باید کمتر از ${maxSizeMB} مگابایت باشد`)
      return
    }

    if (!accept.includes(file.type)) {
      toast.error(`فرمت فایل انتخابی نا معتبر است`)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      if (!withCrop) {
        setLocalValue({ ...file, url: reader.result })
      } else {
        setOriginalFile(file)
        setImageToCrop(reader.result)
        setIsModalOpen(true)
      }
    }

    if (!withCrop) upload(file)
    inputRef.current.value = null
  }

  const handleCropDone = async () => {
    if (!cropperRef.current || !originalFile) return

    const { file, url } = await cropperRef.current.generateCroppedImage(
      originalFile.name,
      originalFile.type
    )

    setLocalValue({ ...file, url })
    upload(file)
    setIsModalOpen(false)
  }

  const handleInputClick = (e) => {
    const isInWebView = isWebView()

    if (isInWebView) {
      e.preventDefault()

      const cb = (files) => {
        const successFiles = files.filter((f) => f.status).map((f) => JSON.parse(f.response))
        setLocalValue(successFiles?.[0])
        onDone?.(successFiles?.[0]?.id || 0)
      }

      pickAndUploadFile(FileTypeEnums.AVATAR, cb, {
        accept,
        maxCount: 1,
        maxSizeB: maxSizeMB * 1024 * 1024,
      })
    }
  }

  const handleButtonClick = () => {
    setMenuOpen(false)
    inputRef.current.click()
  }

  const handleRemove = () => {
    abortRef.current?.abort('cancel by user')
    setMenuOpen(false)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (currentUser?.avatar_file?.id) deleteUserAvatar()
    setLocalValue(null)
    setIsDeleteModalOpen(false)
  }

  useEffect(() => {
    onUploadStateChange?.(uploadState)
  }, [uploadState, onUploadStateChange])

  return (
    <div className="relative w-[120px] h-[120px] mx-auto">
      <div
        className={cn(
          'relative rounded-full mb-1 border-2 flex justify-center items-center overflow-hidden',
          uploadState === 'error' ? 'border-yellow-600' : 'border-primary'
        )}
      >
        <div style={{ paddingBottom: `${previewRatio * 100}%` }} />

        {localValue?.url && (
          <Image
            src={localValue?.url}
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg bg-gray-200"
            alt=""
            width={120}
            height={120}
          />
        )}

        {!localValue && (
          <button
            aria-label="Add"
            type="button"
            onClick={handleButtonClick}
            className="absolute rounded-full top-0 left-0 w-full h-full flex flex-col justify-evenly items-center bg-gray-400 text-gray-300 cursor-cell"
          >
            <UserIcon size={50} />
          </button>
        )}

        {uploadState === 'error' && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
            <Popover>
              <Popover.Trigger>
                <InfoIcon size={36} className="text-yellow-600" />
              </Popover.Trigger>

              <Popover.Content className="text-center text-yellow-600 text-sm">
                آپلود فایل با خطا مواجه شد
              </Popover.Content>
            </Popover>
          </div>
        )}

        {(uploadState === 'loading' || isDeletePending) && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/70 rounded-lg">
            <CircleLoadingIcon size={36} className="animate-spin text-teal-600" />
          </div>
        )}

        <input
          type="file"
          ref={inputRef}
          id="upload-image"
          className="hidden"
          onChange={handleInputChange}
          accept={accept.join(', ')}
          onClick={(e) => handleInputClick(e)}
        />
      </div>

      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger>
          <div className="absolute bottom-0 bg-primary p-1 rounded-full text-white cursor-cell">
            <PencilIcon />
          </div>
        </Popover.Trigger>

        <Popover.Content hideWhenDetached className="px-0 py-2" sideOffset={-20}>
          <div className="divide-y divide-gray-100">
            <ul className="text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
              <li>
                <button
                  type="button"
                  aria-label="remove"
                  className="w-full px-4 py-2 hover:bg-gray-100 text-right"
                  onClick={handleButtonClick}
                >
                  <CirclePlusIcon size={20} className="inline-block ml-1" />
                  افزودن
                </button>
              </li>
              {!!localValue && (
                <ul>
                  <button
                    type="button"
                    aria-label="remove"
                    className="w-full px-4 py-2 hover:bg-gray-100 text-right text-red-600"
                    onClick={handleRemove}
                  >
                    <CircleCloseIcon size={20} className="inline-block ml-1" />
                    حذف
                  </button>
                </ul>
              )}
            </ul>
          </div>
        </Popover.Content>
      </Popover>

      <Modal className="max-w-xl w-[95%]" open={isModalOpen}>
        {imageToCrop && (
          <>
            <ImageCropper
              ref={cropperRef}
              imageSrc={imageToCrop}
              aspect={previewRatio}
              minWidth={100}
              minHeight={100}
              ruleOfThirds
              circularCrop
            />

            <div className="flex items-center gap-4 mt-4">
              <Button className="min-w-28" onClick={handleCropDone}>
                تایید
              </Button>
              <Button variant="outline" className="min-w-28" onClick={() => setIsModalOpen(false)}>
                انصراف
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        className="max-w-sm w-[95%]"
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="flex flex-col items-center">
          <div className="text-rust-600">
            <CircleCloseIcon size={70} />
          </div>

          <div className="mb-6">می‌خوای عکس پروفایلت رو پاک کنی؟</div>

          <div className="flex gap-2 w-full">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              خیر
            </Button>
            <Button className="w-full" onClick={confirmDelete}>
              بله
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AvatarUploader
