import { format } from 'date-fns-jalali'
import {
  ChequeCategoryEnumOptions,
  paymentMethodEnum,
  paymentMethodEnumTranslation,
  personTypeEnumOptions,
} from '../constants'
import { numberSeparator } from '@/utils/number'
import { useDownloadFile } from '@/features/common'
import ImageUploaderGridItem from '@/components/ui/ImageUploader/ImageUploaderGridItem'

function PaymentMethodItem({ payment = {} }) {
  const downloadFileMutation = useDownloadFile()

  return (
    <div className="flex flex-col gap-3 fa">
      <div className="flex justify-between items-center mt-4">
        <div>شیوه پرداخت:</div>
        <div>{paymentMethodEnumTranslation[payment.method]}</div>
      </div>

      <div className="flex justify-between items-center">
        <div>{payment.method === paymentMethodEnum.CHEQUE ? 'تاریخ چک' : 'تاریخ'}:</div>
        <div>{payment.due_date && format(payment.due_date, 'yyyy/MM/dd')}</div>
      </div>

      <div className="flex justify-between items-center">
        <div>{payment.method === paymentMethodEnum.CHEQUE ? 'مبلغ چک' : 'مبلغ'}:</div>
        <div className="flex gap-2">
          {numberSeparator(payment.amount)}
          <p>تومان</p>
        </div>
      </div>

      {payment.method === paymentMethodEnum.CHEQUE && (
        <>
          <div className="flex justify-between items-center">
            <div>شماره چک:</div>
            <div>
              {payment.cheque?.serial} / {payment.cheque?.series}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>شناسه صیاد چک:</div>
            <div>{payment.cheque?.sayaad_code}</div>
          </div>

          <div className="flex justify-between items-center">
            <div>در وجه:</div>
            <div>
              {personTypeEnumOptions.find((i) => i.value === payment.cheque?.payee_type).label}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>کد ملی/ شناسه ملی/ کد اتباع:</div>
            <div>{payment.cheque?.payee_national_code}</div>
          </div>

          <div className="flex justify-between items-center">
            <div>بابت:</div>
            <div>
              {ChequeCategoryEnumOptions.find((i) => i.value === payment.cheque?.category).label}
            </div>
          </div>

          {payment.cheque.image_file && (
            <div className="flex flex-col gap-1.5">
              <div>تصویر چک:</div>
              <div className="w-2/5">
                <ImageUploaderGridItem
                  file={payment.cheque.image_file}
                  ratio={48 / 100}
                  downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
                  key={payment.cheque.image_file.id}
                />
              </div>
            </div>
          )}
        </>
      )}

      {payment.description && (
        <div className="flex items-center ">
          <div>توضیحات: {payment.description}</div>
        </div>
      )}
    </div>
  )
}

export default PaymentMethodItem
