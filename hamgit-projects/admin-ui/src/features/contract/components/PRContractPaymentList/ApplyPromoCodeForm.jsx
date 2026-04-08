import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from '@/components/ui/Toaster'
import { useApplyInvoicePromo } from '../../api/apply-invoice-promo'
import { useDeleteInvoiceDiscount } from '../../api/delete-invoice-discount'
import { handleErrorOnSubmit } from '@/utils/error'

const ApplyPromoCodeForm = ({ invoiceId, discountItemId, onCancel, onApplied }) => {
  const [promoCode, setPromoCode] = useState('')
  const applyPromoMutation = useApplyInvoicePromo({
    onSuccess: () => {
      toast.success('کد تخفیف با موفقیت اعمال شد.')
      setPromoCode('')
      onApplied?.()
    },
    onError: handleErrorOnSubmit,
  })
  const { reset } = applyPromoMutation

  const deleteDiscountMutation = useDeleteInvoiceDiscount({
    onSuccess: () => {
      toast.success('تخفیف حذف شد.')
      onApplied?.()
    },
    onError: handleErrorOnSubmit,
  })

  useEffect(() => {
    setPromoCode('')
    reset()
  }, [invoiceId, reset])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!invoiceId) {
      toast.error('شناسه فاکتور معتبر نیست.')
      return
    }

    if (!promoCode.trim()) {
      toast.error('کد تخفیف را وارد کنید.')
      return
    }

    applyPromoMutation.mutate({
      invoice_id: invoiceId,
      promo_code: promoCode.trim(),
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="شناسه فاکتور" value={invoiceId ? String(invoiceId) : ''} readOnly ltr />

      <Input
        label="کد تخفیف"
        value={promoCode}
        onChange={(event) => setPromoCode(event.target.value)}
        placeholder="مثلاً eGg41OA"
      />

      <div className="flex flex-wrap justify-end gap-2">
        {discountItemId && (
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={() => deleteDiscountMutation.mutate(discountItemId)}
            disabled={deleteDiscountMutation.isPending}
          >
            حذف تخفیف
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={applyPromoMutation.isPending || deleteDiscountMutation.isPending}
        >
          انصراف
        </Button>
        <Button type="submit" size="sm" loading={applyPromoMutation.isPending}>
          اعمال کد
        </Button>
      </div>
    </form>
  )
}

export default ApplyPromoCodeForm
