import { useState } from 'react'
import Button from '@/components/ui/Button'
import { translateEnum } from '@/utils/enum'
import { toast } from '@/components/ui/Toaster'
import { handleErrorOnSubmit } from '@/utils/error'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { partyTypeOptions } from '@/data/enums/prcontract-enums'
import useSignPRContractParty from '../../api/sign-pr-contract-party'
import { CloseIcon, DocumentEditIcon, SendIcon } from '@/components/icons'
import { DatePickerField, Form, InputField, useForm } from '@/components/ui/Form'
import useSendPRContractPartySignOTP from '../../api/send-pr-contract-party-sign-otp'
import useConfirmPRContractPartySignOTP from '../../api/confirm-pr-contract-party-sign-otp'
import { convertEmptyStringsToNull } from '@/utils/object'

const segments = [
  { label: 'با ارسال کد', value: 'otp' },
  {
    label: 'دستی',
    value: 'manual',
  },
]

const PRContractPartySign = ({ contractId, party, partyType, onCancel, onSuccess }) => {
  const [selectedType, setSelectedType] = useState(segments[0])

  const methods = useForm({
    defaultValues: {
      otp: '',
      sign_date: '',
    },
  })

  const sendOtpMutation = useSendPRContractPartySignOTP(contractId, party.id, {
    onSuccess: () => {
      toast.success('کد ارسال شد')
    },
    onError: (e) => {
      handleErrorOnSubmit(e)
    },
  })

  const confirmOtpMutation = useConfirmPRContractPartySignOTP(contractId, party.id)
  const manualSignMutation = useSignPRContractParty(contractId, party.id)

  const handleSubmit = (data, { setError }) => {
    const mutation = selectedType.value == 'otp' ? confirmOtpMutation : manualSignMutation

    mutation.mutate(convertEmptyStringsToNull(data), {
      onSuccess: (res) => {
        toast.success(
          `قرارداد با موفقیت توسط ${translateEnum(partyTypeOptions, partyType)} امضا شد`
        )

        onSuccess(res)
      },
      onError: (e) => {
        handleErrorOnSubmit(e, setError, data)
      },
    })
  }

  return (
    <div className="fa">
      <SegmentedControl value={selectedType} segments={segments} onChange={setSelectedType} />

      {selectedType.value == 'otp' && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="gray"
            loading={sendOtpMutation.isPending}
            onClick={() => sendOtpMutation.mutate()}
          >
            <SendIcon size={14} className="ml-1" />
            ارسال کد به {party.mobile}
          </Button>
        </div>
      )}

      <Form methods={methods} className="mt-4" onSubmit={handleSubmit}>
        <InputField
          ltr
          isNumeric
          name="otp"
          required={selectedType.value == 'otp'}
          label={selectedType.value == 'otp' ? 'کد ارسال شده' : 'کد'}
        />

        {selectedType.value == 'manual' && (
          <DatePickerField
            timePicker
            name="sign_date"
            label="تاریخ امضا"
            format="DD MMMM YYYY - HH:mm:ss"
            inputFormat="yyyy/MM/dd HH:mm:ss"
            outputFormat="YYYY-MM-DD HH:mm:ss"
          />
        )}

        <div className="text-left">
          <Button
            size="sm"
            variant="gray"
            onClick={onCancel}
            disabled={confirmOtpMutation.isPending || manualSignMutation.isPending}
          >
            <CloseIcon size={14} className="ml-1" /> انصراف
          </Button>
          <Button
            size="sm"
            type="submit"
            className="mr-2"
            loading={confirmOtpMutation.isPending || manualSignMutation.isPending}
          >
            <DocumentEditIcon size={14} className="ml-1" /> ثبت
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default PRContractPartySign
