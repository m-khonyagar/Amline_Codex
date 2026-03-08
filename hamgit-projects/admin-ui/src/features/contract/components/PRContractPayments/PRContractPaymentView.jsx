import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { ChevronRightIcon } from '@/components/icons'
import { format } from 'date-fns-jalali'
import { numberSeparator } from '@/utils/number'
import {
  paymentMethod,
  paymentTypeOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  chequeCategoryOptions,
  chequePayeeTypeOptions,
  chequeStatusOptions,
} from '@/data/enums/prcontract-enums'
import ImagePreview from '@/components/ui/ImagePreview'
import { useDownloadFile } from '@/features/misc'
import { InvoiceItemTypeOptions } from '@/data/enums/invoice_enums'

const PRContractPaymentView = ({ payment = {}, onBack }) => {
  payment = payment || {}

  const isCheque = payment.method == paymentMethod.CHEQUE

  const downloadFileMutation = useDownloadFile()

  return (
    <div>
      <div className="p-4 flex flex-col gap-4 fa">
        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-700 mt-1">روش پرداخت:</div>
          <div className="mr-auto">
            {payment.method ? translateEnum(paymentMethodOptions, payment.method) : '-'}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-700 mt-1">نوع پرداخت:</div>
          <div className="mr-auto">
            {payment.type ? translateEnum(paymentTypeOptions, payment.type) : '-'}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-700 mt-1">مبلغ:</div>
          <div className="mr-auto">
            {payment.invoice?.initial_amount ? (
              <>
                {numberSeparator(payment.invoice.initial_amount)}
                <span className="text-sm text-gray-500 mr-1">تومان</span>
              </>
            ) : (
              <span className="text-sm text-red-600">تنظیم نشده است</span>
            )}
          </div>
        </div>

        {payment?.invoice?.items?.map((item) => (
          <div className="flex items-center" key={item.id}>
            <div className="text-sm text-gray-700">
              {translateEnum(InvoiceItemTypeOptions, item.type)}
            </div>
            <div className="mr-auto">
              {item.amount ? (
                <>
                  {numberSeparator(item.amount)}
                  <span className="text-sm text-gray-500 mr-1">تومان</span>
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <div className="text-sm text-gray-700">مبلغ نهایی:</div>
          <div className="mr-auto">
            {payment.invoice?.final_amount != null ? (
              <>
                {numberSeparator(payment.invoice.final_amount)}
                <span className="text-sm text-gray-500 mr-1">تومان</span>
              </>
            ) : (
              <span className="text-sm text-red-600">تنظیم نشده است</span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-700 mt-1">وضعیت پرداخت:</div>
          <div className="mr-auto">
            {payment.status ? translateEnum(paymentStatusOptions, payment.status) : '-'}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-700 mt-1">تاریخ سررسید:</div>
          <div className="mr-auto">
            {payment.due_date ? format(payment.due_date, 'dd MMMM yyyy') : '-'}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-sm text-gray-700 mt-1">توضیحات:</div>
          <div className="mr-auto">{payment.description ? payment.description : '-'}</div>
        </div>

        {isCheque && (
          <>
            <hr />

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">سریال چک:</div>
              <div className="mr-auto">{payment.cheque?.serial ? payment.cheque.serial : '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">سری چک:</div>
              <div className="mr-auto">{payment.cheque?.series ? payment.cheque.series : '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">کد صیاد:</div>
              <div className="mr-auto">
                {payment.cheque?.sayaad_code ? payment.cheque.sayaad_code : '-'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">بابت:</div>
              <div className="mr-auto">
                {payment.cheque?.category
                  ? translateEnum(chequeCategoryOptions, payment.cheque.category)
                  : '-'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">در وجه:</div>
              <div className="mr-auto">
                {payment.cheque?.payee_type
                  ? translateEnum(chequePayeeTypeOptions, payment.cheque.payee_type)
                  : '-'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">کد ملی/ شناسه ملی/ کد اتباع:</div>
              <div className="mr-auto">
                {payment.cheque?.payee_national_code ? payment.cheque.payee_national_code : '-'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">وضعیت چک:</div>
              <div className="mr-auto">
                {payment.cheque?.status
                  ? translateEnum(chequeStatusOptions, payment.cheque.status)
                  : '-'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">تصویر چک:</div>
              <div className="mr-auto flex-grow flex flex-wrap gap-2 justify-end">
                {payment.cheque?.image_file?.id ? (
                  <ImagePreview
                    file={payment.cheque.image_file}
                    className="w-full max-w-20"
                    downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
                  />
                ) : (
                  '-'
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button size="sm" variant="gray" onClick={onBack}>
          <ChevronRightIcon size={14} className="ml-1" /> بازگشت
        </Button>
      </div>
    </div>
  )
}

export default PRContractPaymentView
