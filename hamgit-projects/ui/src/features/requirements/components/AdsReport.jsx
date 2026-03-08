import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { DangerIcon } from '@/components/icons'
import Modal from '@/components/ui/Modal'
import { stringSchema } from '@/utils/schema'
import { handleErrorOnSubmit } from '@/utils/error'
import usePostAdsReport from '../api/post-ads-report'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

export default function AdsReport({ adId, adCategory }) {
  const [modalVisibility, setModalVisibility] = useState(false)

  const methods = useForm({
    defaultValues: { description: '' },
    resolver: zodResolver(z.object({ description: stringSchema })),
  })

  const postAdsReportMutate = usePostAdsReport()

  const handleClose = () => {
    setModalVisibility(false)
    methods.reset()
  }

  const handleSubmit = (data) => {
    const _data = {
      ad_id: adId,
      ad_category: adCategory,
      description: data.description,
    }

    postAdsReportMutate.mutate(_data, {
      onSuccess: (res) => {
        if (res?.data?.message) {
          toast.success(res.data.message)
        }
        handleClose()
      },
      onError: (error) => {
        handleErrorOnSubmit(error)
      },
    })
  }

  return (
    <>
      <button
        type="button"
        className="cursor-pointer flex items-center gap-2"
        onClick={() => setModalVisibility(true)}
      >
        <DangerIcon size={18} color="#BCBEC2" className="inline-block" />
        گزارش تخلف یا رفتار مشکوک
      </button>
      <Modal open={modalVisibility} onClose={handleClose} className="w-[312px] max-w-full">
        <DangerIcon size={52} className="mx-auto text-red-600 mb-2.5" />
        <p className="text-gray-900 text-center font-bold text-[12px] mb-3">
          گزارش تخلف و رفتار مشکوک
        </p>
        <Form methods={methods} onSubmit={(data) => handleSubmit(data)}>
          <InputField
            required
            multiline
            name="description"
            label="توضیحات خود را برای گزارش تایپ کنید:"
          />
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Button type="submit" loading={postAdsReportMutate.isPending}>
              ثبت
            </Button>
            <Button variant="outline" onClick={handleClose}>
              انصراف
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
