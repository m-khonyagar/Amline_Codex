import { CloseIcon, PlusIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import { Form, InputField } from '@/components/ui/Form'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSendInvoiceLinkViaSMS } from '../api/send-invoice-link'

const schema = z.object({
  link: z.string(),
  invoice_id: z.string(),
  mobile: z
    .string()
    .regex(/^0?9\d{9}$/, 'شماره موبایل وارد شده اشتباه است.')
    .transform((value) => (value === '' ? undefined : value))
    .optional(),
})

const SendInvoiceLink = ({ data, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: {
      link: data?.invoice_link,
      invoice_id: data?.invoice_id,
      mobile: undefined,
    },
    resolver: zodResolver(schema),
  })
  const link = methods.getValues('link')

  const sendInvoiceLinkViaSMS = useSendInvoiceLinkViaSMS()

  const handleSubmit = (data) => {
    const _data = {
      ...data,
      ...(data.mobile
        ? { mobile: data.mobile.startsWith('0') ? data.mobile : `0${data.mobile}` }
        : {}),
    }

    sendInvoiceLinkViaSMS.mutate(_data, {
      onSuccess: (res) => {
        toast.success('لینک پرداخت از طریق پیامک ارسال شد.')
        methods.reset()
        onSuccess?.(res.data)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link)
      toast.success('لینک کپی شد.')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }, [link])

  return (
    <div>
      <p className="text-gray-700 mb-2">لینک پرداخت ساخته شد. برای کپی کردن روی لینک کلیک کنید</p>

      <div
        onClick={copyToClipboard}
        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors mb-4"
      >
        <span className="text-blue-600 truncate flex-1">{link}</span>
      </div>

      <Form methods={methods} onSubmit={handleSubmit}>
        <InputField
          ltr
          isNumeric
          type="tel"
          name="mobile"
          label="ارسال به شماره:"
          placeholder="اگر شماره‌ای مشخص نکنید، پیامک به مالک فاکتور ارسال می‌شود."
          disabled={sendInvoiceLinkViaSMS.isPending}
        />

        <div className="text-left mt-4">
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={sendInvoiceLinkViaSMS.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>

          <Button
            size="sm"
            type="submit"
            className="mr-2"
            loading={sendInvoiceLinkViaSMS.isPending}
          >
            <PlusIcon size={14} className="ml-1" /> ارسال
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default SendInvoiceLink
