import { Form, InputField, useForm } from '@/components/ui/Form'
import { handleErrorOnSubmit } from '@/utils/error.js'
import Button from '@/components/ui/Button'
import {
  useAcceptAdVisitRequests,
  useRejectAdVisitRequests,
} from '../../api/status-ads-visit-requests'
import { AdStatusEnums } from '@/data/enums/requirement_enums'

const defaultValues = {
  description: '',
  advertisement_id: '',
}

export default function AdRequestForm({ onCancel, onSuccess, item }) {
  const acceptMutation = useAcceptAdVisitRequests()
  const rejectMutation = useRejectAdVisitRequests()

  const methods = useForm({
    defaultValues,
    values: {
      description: item?.description || '',
      advertisement_id: item?.id,
    },
  })

  const handleAccept = () => {
    acceptMutation.mutate(methods.getValues(), {
      onSuccess: () => {
        onSuccess?.()
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }
  const handleReject = () => {
    rejectMutation.mutate(methods.getValues(), {
      onSuccess: () => {
        onSuccess?.()
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  return (
    <>
      <Form methods={methods}>
        <InputField label="توضیحات" name="description" multiline />
      </Form>

      <div className=" flex items-center mt-5 justify-center gap-2">
        <Button
          size="sm"
          variant="gray"
          onClick={onCancel}
          disabled={acceptMutation.isPending || rejectMutation.isPending}
        >
          انصراف
        </Button>

        <Button
          size="sm"
          variant="default"
          disabled={rejectMutation.isPending || item?.status === AdStatusEnums.ACCEPTED}
          loading={acceptMutation.isPending}
          onClick={handleAccept}
        >
          تایید درخواست
        </Button>

        <Button
          size="sm"
          variant="danger"
          disabled={acceptMutation.isPending || item?.status === AdStatusEnums.REJECTED}
          loading={rejectMutation.isPending}
          onClick={handleReject}
        >
          رد درخواست
        </Button>
      </div>
    </>
  )
}
