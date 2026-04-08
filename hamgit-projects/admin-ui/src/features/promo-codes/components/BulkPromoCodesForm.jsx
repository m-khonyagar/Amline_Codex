import { z } from 'zod'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  InputField,
  InputNumberField,
  SelectField,
  DateTimePickerField,
  useForm,
} from '@/components/ui/Form'
import { useBulkGeneratePromoCode } from '../api/promo-codes'
import { userRoles, userRolesOptions } from '@/data/enums/user-enums'
import { discountTypeOptions, resourceTypeOptions } from '@/data/enums/invoice_enums'
import { cn } from '@/utils/dom'

const schema = z.object({
  count: z.number().min(1, { message: 'حداقل 1' }),
  value: z
    .number({ required_error: 'مقدار تخفیف اجباری است' })
    .min(0, { message: 'مقدار معتبر نیست' }),
  usage_limit: z.number().min(1, { message: 'حداقل 1' }).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  roles: z.array(z.enum(userRoles)),
  specified_user_phone: z.string().optional(),
  resource_type: z.enum(resourceTypeOptions.map((i) => i.value)).optional(),
  discount_type: z.enum(discountTypeOptions.map((i) => i.value)),
  prefix: z.string().optional(),
})

const BulkPromoCodesForm = ({ className, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: {
      count: 1,
      value: undefined,
      usage_limit: 100000,
      start_date: undefined,
      end_date: undefined,
      roles: ['PERSON'],
      specified_user_phone: undefined,
      resource_type: undefined,
      discount_type: discountTypeOptions[0].value,
      prefix: undefined,
    },
    resolver: zodResolver(schema),
  })

  const mutation = useBulkGeneratePromoCode()

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
    }

    mutation.mutate(payload, {
      onSuccess: (res) => {
        methods.reset()
        onSuccess?.(res.data)
      },
      onError: handleErrorOnSubmit,
    })
  }

  return (
    <Form
      methods={methods}
      onSubmit={handleSubmit}
      className={cn('grid sm:grid-cols-2 gap-8', className)}
    >
      <InputNumberField label="مقدار تخفیف" name="value" />

      <SelectField asValue label="نوع تخفیف" name="discount_type" options={discountTypeOptions} />

      <InputNumberField required label="تعداد کد" name="count" />

      <InputNumberField label="سقف استفاده" name="usage_limit" />

      <DateTimePickerField format="YYYY/MM/DD - HH:mm:ss" label="تاریخ شروع" name="start_date" />
      <DateTimePickerField format="YYYY/MM/DD - HH:mm:ss" label="تاریخ پایان" name="end_date" />

      <InputField
        label="شماره تلفن"
        name="specified_user_phone"
        placeholder="فقط برای این شماره قابل استفاده است"
      />

      <SelectField
        asValue
        multiSelect
        label="نقش‌های مجاز"
        name="roles"
        options={userRolesOptions}
      />

      <SelectField asValue label="نوع منبع" name="resource_type" options={resourceTypeOptions} />

      <InputField label="پیشوند کد" name="prefix" />

      <div className="text-left mt-4 col-span-full">
        <Button size="sm" variant="gray" onClick={onCancel} disabled={mutation.isPending}>
          انصراف
        </Button>
        <Button size="sm" type="submit" className="mr-2" loading={mutation.isPending}>
          ثبت
        </Button>
      </div>
    </Form>
  )
}

export default BulkPromoCodesForm
