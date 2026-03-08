import { Fragment } from 'react'
import Button from '@/components/ui/Button'
// import useApplyDiscountCode from '../api/apply-discount-code'
import useDeleteDiscountCode from '../api/delete-discount-code'
// import { Form, InputField, useForm } from '@/components/ui/Form'
// import { handleErrorOnSubmit } from '@/utils/error'
import { cn } from '@/utils/dom'
import { InvoiceItemEnums } from '@/data/enums/invoice_item_enums'
// import { InvoiceStatusEnums } from '@/data/enums/invoice_status_enums'
// import { paymentCategoryEnum } from '@/data/enums/payment_category_enums'
// import { CloseIcon } from '@/components/icons'
import DiscountIcon from '@/components/icons/DiscountIcon'
import TrashIcon from '@/components/icons/TrashIcon'

function Invoice({ invoice, children, contractId, query, showDiscount }) {
  // const methods = useForm({
  //   defaultValues: {
  //     promo_code: '',
  //   },
  // })
  const typeAItems = invoice.items.filter((item) => item.type === 'DISCOUNT')
  // const applyDiscountCodeMutation = useApplyDiscountCode(contractId)
  const deleteDiscountCodeMutation = useDeleteDiscountCode(invoice?.id)

  // const hasDiscountCode = useMemo(
  //   () => (invoice?.invoice_items || []).some((i) => i.type?.id === InvoiceItemEnums.DISCOUNT),
  //   [invoice]
  // )

  // const isSuccess = useMemo(() => invoice?.status?.id === InvoiceStatusEnums.PAID, [invoice])
  // const isCommission = invoice?.category === paymentCategoryEnum.COMMISSION

  // const handleDiscountCode = (data, { setError }) => {
  //   applyDiscountCodeMutation.mutate(
  //     {
  //       promo_code: data.promo_code,
  //       invoice_id: invoice?.id,
  //     },
  //     {
  //       onSuccess: () => {
  //         query?.refetch()
  //       },
  //       onError: (err) => {
  //         handleErrorOnSubmit(err, setError, data)
  //       },
  //     }
  //   )
  // }

  return (
    <>
      <div className="flex items-center justify-between rounded-t-2xl border-b-2 border-gray-200 bg-white px-4 py-5">
        <div className="flex items-center gap-3">
          <DiscountIcon size={24} color={invoice.items?.length > 1 ? '#53bb6a' : '#6B7280'} />
          {invoice.items?.length > 1 ? (
            <p className={`${invoice.items?.length > 1 ? 'text-green-600' : 'text-gray-500'} `}>
              کد تخفیف {typeAItems[0]?.extra_info}
            </p>
          ) : (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">کد تخفیف دارید؟</span>
              <span className="text-xs text-gray-500">کد تخفیف خود را وارد کنید</span>
            </div>
          )}
        </div>
        {invoice.items?.length > 1 ? (
          <Button
            size="icon"
            variant="ghost"
            className="size-9 rounded-md -mt-1 mr-2 text-red-500"
            onClick={() => deleteDiscountCodeMutation.mutate(typeAItems[0]?.id)}
          >
            <TrashIcon size={24} />
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => showDiscount(true)}
            className="rounded-xl border border-teal-500 px-4 py-2 text-sm font-medium text-teal-600 transition hover:bg-teal-50"
          >
            ثبت کد
          </button>
        )}
      </div>

      {!invoice ? (
        <div className="text-center my-6 text-orange-600">
          اطلاعات صورت حساب یافت نشد، لطفا با پشتیبانی تماس بگیرید
        </div>
      ) : (
        <>
          <div className="p-4 bg-white rounded-b-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between fa">
                <p>کمیسیون مصوب اتحادیه املاک </p>
                <p>{invoice.initial_amount.toLocaleString()} تومان</p>
              </div>

              {invoice.items?.length > 0 &&
                invoice.items.map((item) => (
                  <Fragment key={item.id}>
                    <div
                      className={cn('flex fa', {
                        'text-green-600': item.type === InvoiceItemEnums.DISCOUNT,
                      })}
                    >
                      <p>
                        {item.type === InvoiceItemEnums.DISCOUNT
                          ? 'تخفیف'
                          : '٪۱۰ مالیات بر ارزش افزوده '}
                      </p>
                      <p className="mr-auto">
                        <span dir="ltr" className="ml-1">
                          {item.amount.toLocaleString()}
                        </span>
                        تومان
                      </p>
                      {/* {item.type === InvoiceItemEnums.DISCOUNT && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-9 rounded-md -mt-1 mr-2"
                          onClick={() => deleteDiscountCodeMutation.mutate(item.id)}
                        >
                          <CloseIcon size={18} />
                        </Button>
                      )} */}
                    </div>
                  </Fragment>
                ))}

              {/* {!isSuccess && !hasDiscountCode && isCommission && (
              <Form
              methods={methods}
              onSubmit={handleDiscountCode}
              className="flex justify-between items-baseline"
              >
              <p>کد تخفیف</p>
              <InputField
              required
              name="promo_code"
              className="w-[70%]"
              placeholder="وارد کنید"
              error={!!applyDiscountCodeMutation.error}
              suffixAction={
                <Button
                size="sm"
                type="submit"
                variant="outline"
                // className="h-11 ml-0"
                loading={applyDiscountCodeMutation.isPending}
                >
                اعمال
                </Button>
                }
                />
                </Form>
                )} */}
            </div>

            <hr className="my-5 border-t-2 border-gray-200" />

            <div className="flex justify-between  fa">
              <p>مبلغ قابل پرداخت :</p>
              <p>{invoice.final_amount.toLocaleString()} تومان</p>
            </div>
          </div>
          <div className="mt-4 text-center">{children}</div>
        </>
      )}
    </>
  )
}

export default Invoice
