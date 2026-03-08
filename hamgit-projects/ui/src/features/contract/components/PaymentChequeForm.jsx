import { useMemo, useState } from 'react'
import WrapperCard from './WrapperCard'
import { ChequeCategoryEnumOptions, paymentFormTypeEnum, personTypeEnumOptions } from '../constants'
import usePatchPayment from '../api/patch-payment'
import useCreateContractPayment from '../api/create-contract-payment'
import { pickWithDefaults } from '@/utils/object'
import { handleErrorOnSubmit } from '@/utils/error'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { FileTypeEnums } from '@/data/enums/file_type_enums'
import ImageUploaderField from '@/components/ui/Form/ImageUploaderField'
import { useDownloadFile, useUploadFile } from '@/features/common'
import {
  Form,
  useForm,
  InputField,
  SelectField,
  DatePickerField,
  InputNumberField,
} from '@/components/ui/Form'

function PaymentChequeForm({
  contractId,
  onConfirm,
  beforeSubmit,
  defaultValues,
  onCancel,
  paymentType,
}) {
  const [isPendingBeforeSubmit, setIsPendingBeforeSubmit] = useState(false)
  const patchPayment = usePatchPayment(contractId, defaultValues?.id, paymentFormTypeEnum.CHEQUE)
  const createContractPaymentMutation = useCreateContractPayment(
    contractId,
    paymentFormTypeEnum.CHEQUE
  )

  const uploadMutation = useUploadFile({
    fileType: FileTypeEnums.CHEQUE,
  })
  const downloadFileMutation = useDownloadFile()

  const [uploadState, setUploadState] = useState()

  const methods = useForm({
    defaultValues: {
      ...pickWithDefaults(defaultValues, {
        id: null,
        amount: '',
        due_date: '',
        description: '',
      }),
      ...pickWithDefaults(defaultValues?.cheque, {
        category: null,
        payee_national_code: '',
        payee_type: null,
        series: '',
        serial: '',
        sayaad_code: '',
      }),
      cheque_image: defaultValues?.cheque?.image_file
        ? [{ id: defaultValues.cheque.image_file.id }]
        : [],
    },
  })

  const isPending = useMemo(
    () =>
      isPendingBeforeSubmit || createContractPaymentMutation.isPending || patchPayment.isPending,
    [createContractPaymentMutation.isPending, isPendingBeforeSubmit, patchPayment.isPending]
  )

  const handleSubmit = async (data) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
      return
    }

    const image = data.cheque_image?.[0]

    const _data = {
      ...data,
      due_date: data?.due_date.substring(0, 10),
      image_file_id: image?.uploadResponse?.data?.id || image?.id,
      cheque_image: undefined,
      payment_type: paymentType,
    }

    if (beforeSubmit) {
      try {
        setIsPendingBeforeSubmit(true)
        await beforeSubmit()
      } catch (err) {
        return
      } finally {
        setIsPendingBeforeSubmit(false)
      }
    }

    const mutation = _data.id ? patchPayment : createContractPaymentMutation
    mutation.mutate(_data, {
      onError: (err) => {
        handleErrorOnSubmit(err, methods.setError, data)
      },

      onSuccess: (res) => {
        onConfirm?.(res)
      },
    })
  }

  return (
    <WrapperCard>
      <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-2">
        <DatePickerField
          required
          name="due_date"
          label="تاریخ سررسید چک"
          placeholder="1370/12/09"
        />

        <InputNumberField
          required
          name="amount"
          suffix="تومان"
          label="مبلغ چک"
          decimalSeparator="/"
          placeholder="200,000,000"
        />

        <div>
          <div>شماره چک</div>
          <div className="flex items-start mt-2">
            <InputField
              required
              isNumeric
              type="tel"
              placeholder="سریال"
              className="flex-grow"
              name="serial"
            />

            <span className="px-2 text-gray-200 mt-4 text-xl">/</span>

            <InputField
              required
              isNumeric
              type="tel"
              placeholder="سری"
              className="flex-grow"
              name="series"
            />
          </div>
        </div>

        <InputField
          isNumeric
          required
          type="tel"
          label="شناسه صیاد چک"
          placeholder="کد 16 رقمی چک"
          name="sayaad_code"
        />

        <SelectField
          asValue
          required
          label="در وجه"
          name="payee_type"
          placeholder="شخص حقیقی"
          options={personTypeEnumOptions}
        />

        <InputField
          required
          isNumeric
          placeholder="1234567891"
          label="کد ملی/ شناسه ملی/ کد اتباع "
          name="payee_national_code"
        />

        <SelectField
          required
          asValue
          label="بابت"
          placeholder="معاملات اموال غیرمنقول"
          name="category"
          options={ChequeCategoryEnumOptions}
        />

        <ImageUploaderField
          required
          name="cheque_image"
          label="تصویر چک"
          maxImageCount={1}
          uploadFileType={FileTypeEnums.CHEQUE}
          onUploadStateChange={setUploadState}
          downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
          uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
        />

        <InputField multiline label="توضیحات (اختیاری)" name="description" />

        <div className="flex gap-4">
          <Button type="submit" className="basis-1/2" loading={isPending}>
            تایید
          </Button>
          <Button onClick={onCancel} variant="outline" className="basis-1/2" disabled={isPending}>
            انصراف
          </Button>
        </div>
      </Form>
    </WrapperCard>
  )
}

export default PaymentChequeForm
