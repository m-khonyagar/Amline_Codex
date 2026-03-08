import { toast } from '@/components/ui/Toaster'
import Button from '@/components/ui/Button'
import { CloseIcon, DocumentEditIcon, PlusIcon } from '@/components/icons'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { Form, InputField, InputNumberField, useForm } from '@/components/ui/Form'
import { useGetExchangeInfo } from '../api/get-exchange-info'
import { useCreateExchange, useUpdateExchange } from '../api/create-exchange'
import { handleErrorOnSubmit } from '@/utils/error'
import { pickWithDefaults } from '@/utils/object'
import { toEnglishDigits } from '@/utils/number'
import { mobileNumberSchema } from '@/utils/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  mobile: mobileNumberSchema,
  nick_name: z.string(),
  title: z.string({ required_error: 'عنوان الزامی است' }),
  price: z.number({ required_error: 'قیمت الزامی است' }),
  have: z.string({ required_error: 'این فیلد الزامی است' }),
  want: z.string({ required_error: 'این فیلد الزامی است' }),
})

const defaultValues = {
  mobile: '',
  nick_name: '',
  title: undefined,
  price: undefined,
  have: undefined,
  want: undefined,
}

const BarterCreation = ({ barterId, onCancel, onSuccess }) => {
  const getExchangeQuery = useGetExchangeInfo(barterId)
  const exchange = barterId && getExchangeQuery.data

  const hasData = !!exchange?.id

  const createExchange = useCreateExchange()
  const updateExchange = useUpdateExchange(exchange?.id, { enabled: hasData })

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
    values: pickWithDefaults(exchange, defaultValues),
  })

  const create = (_data) => {
    createExchange.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success(`معاوضه با موفقیت ایجاد شد`)
        onSuccess?.(data.id)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const update = (_data) => {
    updateExchange.mutate(_data, {
      onSuccess: ({ data }) => {
        toast.success(`معاوضه با موفقیت ویرایش شد`)
        onSuccess?.(data.id)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleSubmit = (data) => {
    const _data = {
      ...data,
      price: Number(toEnglishDigits(data.price)),
      mobile: data.mobile.replace(/^9/, '09'),
    }

    if (barterId) update(_data)
    else create(_data)
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <LoadingAndRetry query={barterId ? getExchangeQuery : {}}>
        <Form methods={methods} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {!hasData && (
              <InputField
                ltr
                required
                isNumeric
                name="mobile"
                label="شماره موبایل کاربر"
                suffix={<span className="mt-0.5">+98</span>}
              />
            )}

            <InputField required label="نام" name="nick_name" />

            <InputField
              required
              label="عنوان"
              placeholder="معاوضه آپارتمان با خودرو"
              name="title"
            />

            <InputNumberField required min={0} label="قیمت (تومان)" name="price" />

            {hasData && <br className="hidden md:block" />}

            <InputField
              autosize
              multiline
              name="have"
              label="چی دارم"
              placeholder="یه خونه نقلی دارم تو جمهوری، 75 متر، طبقه اول جنوبی، نورگیر عالی، پارکینگ، دارای سند پنج برگی معتبر قابل استعلام و ..."
            />

            <InputField
              autosize
              multiline
              name="want"
              label="چی میخوام"
              placeholder="معاوضه فقط با خودرو ایرانی دارم. اگر قیمت خودرو کمتر باشه مابه تفاوت فقط نقد"
            />
          </div>

          <div className="mt-4 text-left">
            {onCancel && (
              <Button
                size="sm"
                variant="gray"
                onClick={onCancel}
                disabled={createExchange.isPending || updateExchange.isPending}
              >
                <CloseIcon size={14} className="ml-1" /> انصراف
              </Button>
            )}

            <Button
              size="sm"
              type="submit"
              className="mr-2"
              loading={createExchange.isPending || updateExchange.isPending}
            >
              {barterId ? (
                <>
                  <DocumentEditIcon size={14} className="ml-1" />
                  ویرایش
                </>
              ) : (
                <>
                  <PlusIcon size={14} className="ml-1" />
                  ایجاد
                </>
              )}
            </Button>
          </div>
        </Form>
      </LoadingAndRetry>
    </div>
  )
}

export default BarterCreation
