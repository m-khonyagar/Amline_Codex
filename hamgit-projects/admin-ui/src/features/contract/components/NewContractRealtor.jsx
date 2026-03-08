import { PlusIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import useRealtorStartContract from '../api/realtor-start-contract'
import { toast } from '@/components/ui/Toaster'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { useNavigate } from 'react-router-dom'
import { handleErrorOnSubmit } from '@/utils/error'
import DatePickerField from '@/components/ui/Form/DatePickerField'

const NewContractRealtor = () => {
  const navigate = useNavigate()

  const methods = useForm({
    defaultValues: {
      landlord: {
        mobile: '',
        national_code: '',
        birth_date: '',
      },
      tenant: {
        mobile: '',
        national_code: '',
        birth_date: '',
      },
    },
  })

  const realtorStartContractMutation = useRealtorStartContract()

  const handleSubmit = (data, { setError }) => {
    realtorStartContractMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('قرارداد با موفقیت ایجاد شد')
        navigate(`/contracts/prs/${res.data.id}`, { replace: true })
      },
      onError: (e) => handleErrorOnSubmit(e, setError, data),
    })
  }

  return (
    <div className="bg-white rounded-lg max-w-4xl mx-auto">
      <h1 className="font-semibold text-lg px-4 pt-4">ایجاد قرارداد</h1>

      <Form className="mt-6" methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4 md:border-l">
            <h2 className="text-base font-medium mb-2">مالک</h2>

            <InputField required name="landlord.mobile" label="موبایل" placeholder="09xxxxxxxxx" />

            <InputField
              required
              name="landlord.national_code"
              label="کد ملی"
              placeholder="xxxxxxxxxx"
            />

            <DatePickerField
              required
              name="landlord.birth_date"
              label="تاریخ تولد"
              placeholder="انتخاب تاریخ"
              inputFormat="yyyy-MM-dd"
              outputFormat="YYYY-MM-DD"
              format="DD MMMM YYYY"
            />
          </div>

          <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4">
            <h2 className="text-base font-medium mb-2">مستاجر</h2>

            <InputField required name="tenant.mobile" label="موبایل" placeholder="09xxxxxxxxx" />

            <InputField
              required
              name="tenant.national_code"
              label="کد ملی"
              placeholder="xxxxxxxxxx"
            />

            <DatePickerField
              required
              name="tenant.birth_date"
              label="تاریخ تولد"
              placeholder="انتخاب تاریخ"
              inputFormat="yyyy-MM-dd"
              outputFormat="YYYY-MM-DD"
              format="DD MMMM YYYY"
            />
          </div>
        </div>

        <div className="p-4 text-left">
          <Button type="submit" size="sm" loading={realtorStartContractMutation.isPending}>
            <PlusIcon size={14} className="ml-1" />
            ایجاد
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default NewContractRealtor
