import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Button from '@/components/ui/Button'
import { BottomCTA } from '@/features/app'
import { DatePickerField, Form, InputField, useForm } from '@/components/ui/Form'

const formSchema = z.object({
  sheba: z
    .string()
    .min(1, { message: 'این گزینه اجباریه' })
    .min(24, { message: 'شماره اشتباه است' })
    .max(24, { message: 'شماره اشتباه است' }),

  national_code: z
    .string()
    .min(1, { message: 'این گزینه اجباریه' })
    .min(10, { message: 'کد ملی اشتباه است' })
    .max(10, { message: 'کد ملی اشتباه است' }),

  birthday: z.string().date('این گزینه اجباریه'),
  postalcode: z.string(),
  address: z
    .string()
    .min(1, { message: 'این گزینه اجباریه' })
    .max(500, { message: 'آدرس باید کمتر از 500 کاراکتر باشد' }),
})

function IndividualPartyFullInformationForm({ defaultValues, onSubmit, isPending }) {
  // const router = useRouter()
  // const { contractId } = router.query
  // const updateOwnerForm = useUpdateOwnerForm()
  // const completedOwner = usePatchContract(contractId)

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = (data, _methods) => {
    return onSubmit?.(data, _methods)
  }

  // const onSubmitOwnerForm = (data) => {
  //   updateOwnerForm.mutate(
  //     {
  //       sheba: data?.shabaNumber,
  //       address: data?.address,
  //       national_code: data?.nationalCode,
  //       birthday: data?.birthdate,
  //       // postalCode: data?.postalCode, TODO BACK
  //     },
  //     {
  //       onSuccess: (res) => {
  //         toast.error(res?.response?.message)
  //         router.push(`/contracts/${contractId}/manage/renter-data`)
  //         completedOwner.mutate({
  //           is_owner: true,
  //         })
  //       },
  //       onError: (error) => {
  //         toast.error(error?.response?.message)
  //         handleErrorOnSubmit(error, methods.setError, data)
  //         completedOwner.mutate({
  //           is_owner: true,
  //         })
  //       },
  //     }
  //   )
  // }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-2">
      <InputField
        isNumeric
        type="tel"
        label="کد ملی"
        name="national_code"
        placeholder="1234567890"
        readOnly={!!defaultValues.national_code}
      />

      <DatePickerField
        valueFormat="yyyy-MM-dd"
        name="birthday"
        label="تاریخ تولد"
        placeholder="9 اسفند 1370"
        readOnly={!!defaultValues.birthday}
      />

      <InputField
        ltr
        isNumeric
        type="tel"
        name="sheba"
        suffix="IR"
        label="شماره شبا"
        placeholder="1234-5678-9101-2345"
      />

      <InputField
        isNumeric
        type="tel"
        name="postalcode"
        placeholder="0123456789"
        label="کد پستی محل سکونت (اختیاری)"
      />

      <InputField
        multiline
        name="address"
        label="آدرس محل سکونت"
        placeholder="تهران، شهرری، میدان شهدای شاملو، خیابان فرمانداری، کوچه 14، پلاک 32، طبقه سوم، واحد 5"
      />

      <BottomCTA transparent>
        <Button className="w-full" type="submit" loading={isPending}>
          ذخیره و ادامه
        </Button>
      </BottomCTA>
    </Form>
  )
}

export default IndividualPartyFullInformationForm
