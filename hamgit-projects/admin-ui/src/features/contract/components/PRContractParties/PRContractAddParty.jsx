import { Form, useForm } from '@/components/ui/Form'
import useAddPRContractParty from '../../api/add-pr-contract-party'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import Button from '@/components/ui/Button'
import { CloseIcon, DocumentEditIcon } from '@/components/icons'
import { SelectUserField } from '@/features/misc'

const PRContractAddParty = ({ contractId, partyType, onCancel, onSuccess }) => {
  const methods = useForm({
    defaultValues: {
      user_id: '',
      party_type: partyType,
    },
  })

  const addPRContractPartyMutation = useAddPRContractParty(contractId)

  const handleSubmit = (data, { setError }) => {
    addPRContractPartyMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success('طرف قرارداد با موفقیت اضافه شد')

        onSuccess(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <div className="text-left">
        {/* <UserSelect
          label="جستجو بر اساس موبایل"
          onChange={(value) => methods.setValue('user_id', value)}
        /> */}

        <SelectUserField name="user_id" />

        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={addPRContractPartyMutation.isPending}
        >
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>
        <Button
          size="sm"
          type="submit"
          className="mr-2"
          loading={addPRContractPartyMutation.isPending}
        >
          <DocumentEditIcon size={14} className="ml-1" /> ثبت
        </Button>
      </div>
    </Form>
  )
}

export default PRContractAddParty
