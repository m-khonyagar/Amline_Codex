import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { useContractLogic } from '@/features/contract'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import IndividualPartyMinimalInformationForm from '../components/IndividualPartyMinimalInformationForm'
import { handleErrorOnSubmit } from '@/utils/error'
import useBack from '@/hooks/use-back'
import useGetContractStatus from '../api/get-contract-status'
import useGetPrContractsPartiesTenant from '../api/get-pr-contracts-parties-tenant'
import usePatchPrContractsPartiesTenant from '../api/patch-pr-contracts-parties-tenant'
import { DatePickerField, Form, InputField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { addressSchema, ibanSchema, nationalCodeSchema, stringSchema } from '@/utils/schema'
import { useAuthContext } from '@/features/auth'

const formSchema = z.object({
  national_code: nationalCodeSchema,
  birth_date: z.string().date('این گزینه اجباریه'),
  postal_code: z.string(),
  address: addressSchema,
  iban: ibanSchema,
  iban_owner_name: stringSchema,
  // family_members_count: z.coerce.number().min(1, 'تعداد مستاجران باید حداقل 1 باشد'),
})

function TenantPartyInformation() {
  const router = useRouter()
  const { goBack } = useBack()
  const { contractId } = router.query
  const backUrl = `/contracts/${contractId}/manage`
  const { currentUser } = useAuthContext()

  const patchPartiesTenantMutate = usePatchPrContractsPartiesTenant(contractId)
  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })

  const { data: statuses } = contractStatusQuery

  const { signedByCurrentUser, isCurrentUserSecondSide } = useContractLogic(statuses)

  const partiesTenantQuery = useGetPrContractsPartiesTenant(contractId, {
    enabled: router.isReady && isCurrentUserSecondSide,
  })
  const { data: tenantData } = partiesTenantQuery

  const methods = useForm({
    values: {
      national_code: tenantData?.user.national_code || '',
      birth_date: tenantData?.user.birth_date || '',
      postal_code: tenantData?.user.postal_code || '',
      address: tenantData?.user.address || '',
      iban: tenantData?.bank_account?.iban || '',
      iban_owner_name: tenantData?.bank_account?.owner_name || '',
      // family_members_count: tenantData?.family_members_count || '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data, { setError }) => {
    patchPartiesTenantMutate.mutate(data, {
      onSuccess: () => {
        goBack(backUrl)
      },
      onError: (err) => {
        handleErrorOnSubmit(err, setError, data)
      },
    })
  }

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  return (
    <>
      <HeaderNavigation title="اطلاعات مستاجر" backUrl={backUrl} />
      <div className="px-8 mt-6">
        <LoadingAndRetry skeletonItemCount={5} skeletonItemHeight={45} query={contractStatusQuery}>
          {statuses &&
            (isCurrentUserSecondSide ? (
              <LoadingAndRetry query={partiesTenantQuery}>
                {tenantData && (
                  <Form methods={methods} onSubmit={onSubmit} className="flex flex-col gap-2">
                    <InputField
                      isNumeric
                      type="text"
                      label="کد ملی"
                      name="national_code"
                      placeholder="1234567890"
                      readOnly={currentUser?.is_verified}
                      maxLength={10}
                      minLength={10}
                      inputmode="numeric"
                      pattern="[0-9]*"
                    />

                    <DatePickerField
                      valueFormat="yyyy-MM-dd"
                      name="birth_date"
                      label="تاریخ تولد"
                      placeholder="9 اسفند 1370"
                      readOnly={currentUser?.is_verified}
                    />

                    <InputField
                      ltr
                      isNumeric
                      type="text"
                      name="iban"
                      suffix="IR"
                      label="شماره شبا"
                      placeholder="123456000000004518264578"
                      maxLength={24}
                      minLength={24}
                      inputmode="numeric"
                      pattern="[0-9]*"
                    />

                    <InputField name="iban_owner_name" label="به نام" placeholder="علی رفیعی" />

                    <InputField
                      isNumeric
                      type="text"
                      name="postal_code"
                      placeholder="0123456789"
                      label="کد پستی محل سکونت (اختیاری)"
                      maxLength={10}
                      minLength={10}
                      inputmode="numeric"
                      pattern="[0-9]*"
                    />

                    <InputField
                      multiline
                      name="address"
                      label="آدرس محل سکونت"
                      placeholder="تهران، شهرری، میدان شهدای شاملو، خیابان فرمانداری، کوچه 14، پلاک 32، طبقه سوم، واحد 5"
                    />

                    {/* Moved this field into the Specifications of property */}
                    {/* <InputField
                      isNumeric
                      type="tel"
                      placeholder="3"
                      suffix="نفر"
                      label="تعداد مستاجران"
                      name="family_members_count"
                    /> */}

                    <BottomCTA transparent>
                      <Button
                        className="w-full"
                        type="submit"
                        loading={patchPartiesTenantMutate.isPending}
                      >
                        ذخیره و ادامه
                      </Button>
                    </BottomCTA>
                  </Form>
                )}
              </LoadingAndRetry>
            ) : (
              <IndividualPartyMinimalInformationForm />
            ))}
        </LoadingAndRetry>
      </div>
    </>
  )
}

export default TenantPartyInformation
