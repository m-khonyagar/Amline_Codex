import { PlusIcon } from '@/components/icons'
import Button from '@/components/ui/Button'
import SegmentedControl from '@/components/ui/SegmentedControl'
import useStartContract from '../../api/start-contract'
import useCreateEmptyContract from '../../api/create-empty-contract'
import { toast } from '@/components/ui/Toaster'
import {
  CheckboxField,
  Form,
  SelectField,
  InputField,
  useForm,
  useFormValues,
} from '@/components/ui/Form'
import { findOption } from '@/utils/enum'
import { useNavigate } from 'react-router-dom'
import { SelectUserField } from '@/features/misc'
import { handleErrorOnSubmit } from '@/utils/error'
import {
  partyType,
  contractType,
  partyTypeOptions,
  contractTypeOptions,
} from '@/data/enums/prcontract-enums'

const NewContract = () => {
  const navigate = useNavigate()

  const startContractMutation = useStartContract()
  const createEmptyContractMutation = useCreateEmptyContract()

  const methods = useForm({
    defaultValues: {
      contract_type: contractType.PROPERTY_RENT,
      is_guaranteed: false,
      owner: {
        user_id: null,
        party_type: partyType.LANDLORD,
      },
      tracking_code: '',
    },
  })

  const formValues = useFormValues(methods)

  const handleSubmit = (data, { setError }) => {
    const { tracking_code, ...payload } = data

    if (data.contract_type === 'TRACKING_CODE') {
      createEmptyContractMutation.mutate(
        { tracking_code },
        {
          onSuccess: (res) => {
            toast.success('قرارداد با موفقیت ایجاد شد')
            navigate(`/contracts/prs/${res.data.id}`, { replace: true })
          },
          onError: (e) => handleErrorOnSubmit(e, setError, data),
        }
      )
      return
    }

    startContractMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success('قرارداد با موفقیت ایجاد شد')
        navigate(`/contracts/prs/${res.data.id}`, { replace: true })
      },
      onError: (e) => handleErrorOnSubmit(e, setError, data),
    })
  }

  return (
    <div className="bg-white rounded-lg max-w-4xl mx-auto">
      <h1 className="font-semibold text-lg px-4 pt-4">ایجاد قرارداد جدید</h1>

      <Form className="mt-4" methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4 md:border-l">
            <SelectField
              asValue
              name="contract_type"
              label="نوع قرارداد"
              options={[
                ...contractTypeOptions,
                { label: 'ایجاد با کد رهگیری', value: 'TRACKING_CODE' },
              ]}
            />

            {formValues.contract_type !== 'TRACKING_CODE' && (
              <CheckboxField name="is_guaranteed" label="قرداداد ضمانتی" />
            )}
          </div>

          {formValues.contract_type === 'TRACKING_CODE' ? (
            <div className="md:basis-1/2 py-2 px-4 flex-grow">
              <InputField required name="tracking_code" label="کد رهگیری" />
            </div>
          ) : (
            <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4">
              <div>
                <h2 className="mb-1">شروع کننده قرارداد</h2>

                <SegmentedControl
                  segments={partyTypeOptions}
                  value={findOption(partyTypeOptions, formValues.owner.party_type)}
                  onChange={(e) => methods.setValue('owner.party_type', e.value)}
                />
              </div>

              <SelectUserField
                required
                label="جستجو بر اساس موبایل"
                name="owner.user_id"
                // onChange={(value) => methods.setValue('owner.user_id', value)}
              />
            </div>
          )}
        </div>

        <div className="p-4 text-left">
          <Button type="submit" size="sm" loading={startContractMutation.isPending}>
            <PlusIcon size={14} className="ml-1" />
            ایجاد
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default NewContract
