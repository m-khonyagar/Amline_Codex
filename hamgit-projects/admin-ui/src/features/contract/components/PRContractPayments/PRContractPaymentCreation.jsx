import { useState } from 'react'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import { pickWithDefaults } from '@/utils/object'
import { FileType } from '@/data/enums/file_enums'
import { handleErrorOnSubmit } from '@/utils/error'
import { useDownloadFile, useUploadFile } from '@/features/misc'
import ImageUploaderField from '@/components/ui/Form/ImageUploaderField'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'
import useCreatePRContractPayment from '../../api/create-pr-contract-payment'
import useUpdatePRContractPayment from '../../api/update-pr-contract-payment'
import {
  partyType,
  paymentType,
  paymentStatus,
  paymentMethod,
  partyTypeOptions,
  paymentTypeOptions,
  chequeStatusOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  chequeCategoryOptions,
  chequePayeeTypeOptions,
} from '@/data/enums/prcontract-enums'
import {
  Form,
  useForm,
  InputField,
  SelectField,
  DatePickerField,
  InputNumberField,
} from '@/components/ui/Form'

const PRContractPaymentCreation = ({ contractId, payment, onCancel, onSuccess }) => {
  const editMode = !!payment?.id

  const [uploadState, setUploadState] = useState()

  const downloadFileMutation = useDownloadFile()
  const uploadMutation = useUploadFile({ fileType: FileType.CHEQUE })

  const methods = useForm({
    defaultValues: pickWithDefaults(payment, {
      payer: partyType.TENANT,
      payee: partyType.LANDLORD,
      method: paymentMethod.CASH,
      type: paymentType.RENT,
      amount: '',
      status: paymentStatus.UNPAID,
      due_date: '',
      description: '',
      'cheque_data.serial': { path: 'cheque.serial', default: '' },
      'cheque_data.series': { path: 'cheque.series', default: '' },
      'cheque_data.status': { path: 'cheque.status', default: '' },
      'cheque_data.category': { path: 'cheque.category', default: '' },
      'cheque_data.payee_type': { path: 'cheque.payee_type', default: '' },
      'cheque_data.sayaad_code': { path: 'cheque.sayaad_code', default: '' },
      'cheque_data.image_file_id': { path: 'cheque.image_file_id', default: '' },
      'cheque_data.payee_national_code': { path: 'cheque.payee_national_code', default: '' },
    }),
  })

  const method = methods.watch('method')
  const isCheque = method == paymentMethod.CHEQUE

  const createPaymentMutation = useCreatePRContractPayment(contractId)
  const updatePaymentMutation = useUpdatePRContractPayment(contractId)

  const mutation = editMode ? updatePaymentMutation : createPaymentMutation

  const handleSubmit = (data, { setError }) => {
    if (uploadState === 'loading') {
      toast.info('تا بارگذاری کامل فایل‌ها صبر کنید')
      return
    }

    if (uploadState === 'error') {
      toast.warning('بارگذاری برخی از فایل‌ها ناموفق بوده است.')
      return
    }

    const _data = { ...data }

    if (data.method == paymentMethod.CHEQUE) {
      _data.cheque_data = {
        ...data.cheque_data,
        image_file_id: data.cheque_data.image_file_id?.[0]?.uploadResponse?.data?.id,
      }
    } else {
      _data.cheque_data = null
    }

    mutation.mutate(_data, {
      onSuccess: (res) => {
        toast.success(`پرداخت با موفقیت ${editMode ? 'ویرایش' : 'ایجاد'} شد`)

        onSuccess?.(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <div className="bg-white rounded-lg py-2 px-4 fa">
      <h2 className="text-lg font-semibold border-b py-2">
        {editMode ? 'ویرایش' : 'ایجاد'} پرداخت
      </h2>

      <Form
        methods={methods}
        onSubmit={handleSubmit}
        className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4"
      >
        <SelectField
          required
          asValue
          name="payer"
          label="پرداخت کننده"
          options={partyTypeOptions}
        />

        <SelectField
          required
          asValue
          name="payee"
          label="دریافت کننده"
          options={partyTypeOptions}
        />

        <SelectField
          required
          asValue
          name="method"
          label="روش پرداخت"
          options={paymentMethodOptions}
        />

        <SelectField required asValue name="type" label="نوع پرداخت" options={paymentTypeOptions} />

        <InputNumberField
          required
          label="مبلغ"
          suffix="تومان"
          name="amount"
          decimalSeparator="/"
          placeholder="2,000,000"
        />

        <SelectField
          required
          asValue
          name="status"
          label="وضعیت پرداخت"
          options={paymentStatusOptions}
        />

        <DatePickerField required label="تاریخ سررسید" placeholder="انتخاب کنید" name="due_date" />

        <InputField multiline name="description" label="توضیحات" />

        {isCheque && (
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 bg-gray-50 px-4 rounded-lg">
            <h2 className="col-span-2 text-base font-semibold border-b py-2 mb-4">اطلاعات چک</h2>

            <InputField required label="سریال چک" name="cheque_data.serial" />

            <InputField required label="سری چک" name="cheque_data.series" />

            <InputField required convertNumbers label="کد صیاد" name="cheque_data.sayaad_code" />

            <SelectField
              required
              asValue
              label="بابت"
              name="cheque_data.category"
              options={chequeCategoryOptions}
            />

            <SelectField
              required
              asValue
              label="در وجه"
              options={chequePayeeTypeOptions}
              name="cheque_data.payee_type"
            />

            <InputField
              ltr
              isNumeric
              required
              label="کد ملی/ شناسه ملی/ کد اتباع"
              name="cheque_data.payee_national_code"
            />

            <SelectField
              required
              asValue
              label="وضعیت چک"
              name="cheque_data.status"
              options={chequeStatusOptions}
            />

            <ImageUploaderField
              withCrop
              required
              label="تصویر چک"
              maxImageCount={1}
              getValues={methods.getValues}
              name="cheque_data.image_file_id"
              // uploadFileType={FileTypeEnums.CHEQUE}
              onUploadStateChange={setUploadState}
              downloadRequest={(fileId) => downloadFileMutation.mutateAsync(fileId)}
              uploadRequest={(file, { signal }) => uploadMutation.mutateAsync({ file, signal })}
            />
          </div>
        )}

        <div className="mt-4 text-left md:col-span-2">
          <Button size="sm" variant="gray" onClick={onCancel} disabled={mutation.isPending}>
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button size="sm" type="submit" className="mr-2" loading={mutation.isPending}>
            {editMode ? (
              <>
                <DocumentEditIcon size={14} className="ml-1" /> ویرایش
              </>
            ) : (
              <>
                <PlusIcon size={14} className="ml-1" /> ثبت
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractPaymentCreation
