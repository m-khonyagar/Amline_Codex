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
import useGetPrContractsPartiesLandlord from '../api/get-pr-contracts-parties-landlord'
import usePatchPrContractsPartiesLandlord from '../api/patch-pr-contracts-parties-landlord'
import { DatePickerField, Form, InputField, useForm } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { addressSchema, ibanSchema, nationalCodeSchema, stringSchema } from '@/utils/schema'
import { useAuthContext } from '@/features/auth'

const formSchema = z.object({
  national_code: nationalCodeSchema,
  birth_date: z.string().date('این گزینه اجباریه'),
  postal_code: z.string(),
  address: addressSchema,
  rent_iban: ibanSchema,
  rent_iban_owner_name: stringSchema,
  deposit_iban: ibanSchema,
  deposit_iban_owner_name: stringSchema,
})

function LandlordPartyInformation() {
  const router = useRouter()
  const { goBack } = useBack()
  const { contractId } = router.query
  const backUrl = `/contracts/${contractId}/manage`
  const { currentUser } = useAuthContext()

  const patchPartiesLandlordMutate = usePatchPrContractsPartiesLandlord(contractId)
  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })

  const { data: statuses } = contractStatusQuery

  const { signedByCurrentUser, isCurrentUserFirstSide } = useContractLogic(statuses)

  const partiesLandlordQuery = useGetPrContractsPartiesLandlord(contractId, {
    enabled: router.isReady && isCurrentUserFirstSide,
  })

  const { data: landlordData } = partiesLandlordQuery

  const methods = useForm({
    values: {
      national_code: landlordData?.user.national_code || '',
      birth_date: landlordData?.user.birth_date || '',
      postal_code: landlordData?.user.postal_code || '',
      address: landlordData?.user.address || '',
      rent_iban: landlordData?.rent_bank_account.iban || '',
      rent_iban_owner_name: landlordData?.rent_bank_account.owner_name || '',
      deposit_iban: landlordData?.deposit_bank_account.iban || '',
      deposit_iban_owner_name: landlordData?.deposit_bank_account.owner_name || '',
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data, { setError }) => {
    patchPartiesLandlordMutate.mutate(
      { ...data, postal_code: data.postal_code || null },
      {
        onSuccess: () => {
          goBack(backUrl)
        },
        onError: (err) => {
          handleErrorOnSubmit(err, setError, data)
        },
      }
    )
  }

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  return (
    <>
      <HeaderNavigation title="اطلاعات مالک" backUrl={backUrl} />
      <div className="px-8 mt-6">
        <LoadingAndRetry skeletonItemCount={5} skeletonItemHeight={45} query={contractStatusQuery}>
          {statuses &&
            (isCurrentUserFirstSide ? (
              <LoadingAndRetry query={partiesLandlordQuery}>
                {landlordData && (
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
                      name="deposit_iban"
                      suffix="IR"
                      label="شماره شبا برای رهن"
                      placeholder="123456000000004518264578"
                      helperText="دوست داری مستاجر مبلغ رهن رو به کدوم کارتت بزنه؟"
                      maxLength={24}
                      minLength={24}
                      inputmode="numeric"
                      pattern="[0-9]*"
                    />

                    <InputField
                      name="deposit_iban_owner_name"
                      label="به نام"
                      placeholder="علی رفیعی"
                    />

                    <InputField
                      ltr
                      isNumeric
                      type="text"
                      name="rent_iban"
                      suffix="IR"
                      label="شماره شبا برای اجاره"
                      placeholder="123456000000004518264578"
                      helperText="دوست داری مستاجر مبلغ اجاره رو به کدوم کارتت بزنه؟"
                      maxLength={24}
                      minLength={24}
                      inputmode="numeric"
                      pattern="[0-9]*"
                    />

                    <InputField
                      name="rent_iban_owner_name"
                      label="به نام"
                      placeholder="علی رفیعی"
                    />

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

                    <BottomCTA transparent>
                      <Button
                        className="w-full"
                        type="submit"
                        loading={patchPartiesLandlordMutate.isPending}
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

export default LandlordPartyInformation
