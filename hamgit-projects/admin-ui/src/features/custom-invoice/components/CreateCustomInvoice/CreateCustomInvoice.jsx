import { z } from 'zod'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import { zodResolver } from '@hookform/resolvers/zod'
import { CloseIcon, PlusIcon } from '@/components/icons'
import { mobileNumberSchema } from '@/utils/schema'
import { Form, InputField, InputNumberField, SelectField, useForm } from '@/components/ui/Form'
import { useCreateCustomPaymentLink } from '@/data/api/custom-payment-link'

const GATEWAYS = [
  {
    label: 'پارسیان',
    value: 'PARSIAN',
  },
  {
    label: 'زرین‌پال',
    value: 'ZARINPAL',
  },
]

const TYPES = [
  {
    label: 'بیعانه',
    value: 'ERNEST_MONEY',
  },
]

const CreateCustomInvoice = ({ onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: {
      mobile: '',
      amount: undefined,
      type: TYPES[0].value,
      gateway: GATEWAYS[0].value,
    },
    resolver: zodResolver(
      z.object({
        mobile: mobileNumberSchema,
        amount: z.number().min(1000, { message: 'مبلغ باید بیشتر از 1,000 تومان باشد' }),
        type: z.enum(
          TYPES.map((item) => item.value),
          { message: 'نوع پرداخت الزامی است' }
        ),
        gateway: z.enum(
          GATEWAYS.map((item) => item.value),
          { message: 'نوع درگاه پرداخت الزامی است' }
        ),
      })
    ),
  })

  const createMutation = useCreateCustomPaymentLink()

  const handleSubmit = (data) => {
    const _data = { ...data, mobile: data.mobile.startsWith('0') ? data.mobile : `0${data.mobile}` }

    createMutation.mutate(_data, {
      onSuccess: (res) => {
        methods.reset()
        onSuccess?.(res.data)
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  return (
    <div>
      <Form methods={methods} onSubmit={handleSubmit}>
        <InputField ltr required isNumeric label="موبایل" name="mobile" />

        <InputNumberField required min={0} label="مبلغ" suffix="تومان" name="amount" />

        <SelectField asValue required label="نوع" name="type" options={TYPES} />

        <SelectField asValue required label="درگاه پرداخت" name="gateway" options={GATEWAYS} />

        <div className="text-left mt-4">
          <Button size="sm" variant="gray" onClick={onCancel} disabled={createMutation.isPending}>
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button size="sm" type="submit" className="mr-2" loading={createMutation.isPending}>
            <PlusIcon size={14} className="ml-1" /> ثبت
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default CreateCustomInvoice
