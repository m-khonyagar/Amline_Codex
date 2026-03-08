import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { BottomCTA } from '@/features/app'
import { mobileNumberSchema, nationalCodeSchema } from '@/utils/schema'
import Button from '@/components/ui/Button'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { handleErrorOnSubmit } from '@/utils/error'
import useBack from '@/hooks/use-back'
import useCreatePrContractsParties from '../api/create-pr-contract-parties'
import useGetPrContractsCounterParties from '../api/get-pr-contracts-counter-parties'
import { pickWithDefaults } from '@/utils/object'
import LoadingAndRetry from '@/components/LoadingAndRetry'

const formSchema = z.object({
  mobile: mobileNumberSchema,
  national_code: nationalCodeSchema,
})

const defaultValues = {
  mobile: '',
  national_code: '',
}

function IndividualPartyMinimalInformationForm() {
  const router = useRouter()
  const { goBack } = useBack()

  const { contractId } = router.query
  const backUrl = `/contracts/${contractId}/manage`

  const partiesQuery = useGetPrContractsCounterParties(contractId, {
    enabled: router.isReady,
  })
  const { data: partiesData } = partiesQuery

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(formSchema),
    values: pickWithDefaults(partiesData, defaultValues),
  })

  const createPrContractsPartiesMutate = useCreatePrContractsParties(contractId)

  const onSubmit = (data) => {
    createPrContractsPartiesMutate.mutate(
      {
        national_code: data.national_code,
        mobile: data.mobile,
      },
      {
        onSuccess: () => {
          goBack(backUrl)
        },
        onError: (err) => {
          handleErrorOnSubmit(err, methods.setError, data)
        },
      }
    )
  }

  return (
    <LoadingAndRetry query={partiesQuery}>
      <Form methods={methods} onSubmit={onSubmit} className="flex flex-col gap-2">
        <InputField
          name="mobile"
          label="شماره تماس"
          isNumeric
          type="text"
          IndividualPartyMinimalInformationForm
          maxLength={11}
          minLength={11}
          inputmode="numeric"
          pattern="[0-9]*"
        />

        <InputField
          isNumeric
          type="text"
          label="کد ملی"
          name="national_code"
          helperText="* مالکیت کد ملی و شماره تماس باید تطابق داشته باشند"
          maxLength={10}
          minLength={10}
          inputmode="numeric"
          pattern="[0-9]*"
        />

        <BottomCTA transparent>
          <Button
            className="w-full"
            type="submit"
            loading={createPrContractsPartiesMutate.isPending}
          >
            ذخیره و ادامه
          </Button>
        </BottomCTA>
      </Form>
    </LoadingAndRetry>
  )
}

export default IndividualPartyMinimalInformationForm
