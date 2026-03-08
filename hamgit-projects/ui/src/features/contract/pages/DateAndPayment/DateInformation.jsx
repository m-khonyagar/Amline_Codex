import { useRouter } from 'next/router'
import { useEffect, useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import { DatePickerField, Form, InputNumberField, useForm } from '@/components/ui/Form'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { handleErrorOnSubmit } from '@/utils/error'
import { pickWithDefaults } from '@/utils/object'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useBack from '@/hooks/use-back'
import {
  prContractPaymentTypeEnum,
  useContractLogic,
  useGetContract,
  useGetContractPayments,
} from '@/features/contract'
import usePatchPrContractsDatesAndPenalties from '../../api/patch-pr-contracts-dates-and-penalties'
import useGetContractStatus from '../../api/get-contract-status'
import Modal from '@/components/ui/Modal'
import { InfoIcon } from '@/components/icons'
import { getDateAndPaymentSteps } from '../../libs/date-payment-steps'

const defaultValues = {
  contract_date: '',
  property_handover_date: '',
  start_date: '',
  end_date: '',
  landlord_penalty_fee: '',
  tenant_penalty_fee: '',
}

const calcBack = (statuses, contractId) => {
  const steps = statuses ? getDateAndPaymentSteps(statuses) : []
  const isCompletedAllSteps = steps.every((s) => s.completed)
  const link = isCompletedAllSteps
    ? `/contracts/${contractId}/manage`
    : `/contracts/${contractId}/manage/date-payment`

  return {
    url: link,
    count: isCompletedAllSteps ? 2 : 1,
  }
}

function DateInformationPage() {
  const { goBack } = useBack()
  const router = useRouter()
  const { contractId } = router.query

  const contractQuery = useGetContract(contractId, { enabled: router.isReady })
  const patchDatesAndPenaltiesMutation = usePatchPrContractsDatesAndPenalties(contractId)
  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })

  const { data: statuses } = contractStatusQuery
  const { data: payments } = useGetContractPayments(contractId)
  const { signedByCurrentUser } = useContractLogic(statuses)
  const backUrl = useMemo(() => calcBack(statuses, contractId).url, [contractId, statuses])

  const installments = (payments || []).filter((p) => p.type === prContractPaymentTypeEnum.RENT)

  const methods = useForm({
    defaultValues,
    values: {
      ...pickWithDefaults(contractQuery.data, defaultValues),
      contract_date: contractQuery.data?.contract.date,
    },
  })

  const handleBack = (data) => {
    const { url, count } = calcBack(data || statuses, contractId)
    goBack(url, count)
  }

  const onSubmitDateInformation = (data) => {
    patchDatesAndPenaltiesMutation.mutate(
      {
        ...data,
        contract_date: data.contract_date.substring(0, 10),
        property_handover_date: data.property_handover_date.substring(0, 10),
        start_date: data.start_date.substring(0, 10),
        end_date: data.end_date.substring(0, 10),
      },
      {
        onSuccess: () => {
          contractStatusQuery.refetch().then((res) => {
            handleBack(res.data)
          })
        },
        onError: (err) => {
          handleErrorOnSubmit(err, methods.setError, data)
        },
      }
    )
  }

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  const [showAlert, setShowAlert] = useState(false)
  const [confirmChangeDates, setConfirmChangeDates] = useState(false)
  const checkConfirm = () => {
    if (installments.length > 0 && !confirmChangeDates) {
      setShowAlert(true)
    }
  }
  const handleConfirmChangeDate = () => {
    setShowAlert(false)
    setConfirmChangeDates(true)
  }

  return (
    <div>
      <HeaderNavigation title="تاریخ و وجه التزام" backUrl={backUrl} />

      <div className="px-8 py-6">
        <LoadingAndRetry query={contractQuery}>
          {contractQuery.data && (
            <Form
              methods={methods}
              onSubmit={onSubmitDateInformation}
              className="flex flex-col gap-2"
            >
              <DatePickerField
                required
                placeholder="انتخاب کنید"
                label="تاریخ عقد قرارداد"
                name="contract_date"
              />

              <DatePickerField
                required
                label="تاریخ شروع"
                placeholder="انتخاب کنید"
                name="start_date"
                onFocus={checkConfirm}
              />

              <DatePickerField
                required
                label="تاریخ پایان"
                placeholder="انتخاب کنید"
                name="end_date"
                onFocus={checkConfirm}
              />

              <DatePickerField
                required
                label="تاریخ تحویل ملک"
                placeholder="انتخاب کنید"
                name="property_handover_date"
              />

              <InputNumberField
                required
                suffix="تومان"
                decimalSeparator="/"
                placeholder="2,000,000"
                label="وجه التزام از مستاجر"
                name="tenant_penalty_fee"
                helperText="* مبلغی که اگر مستاجر بعد از اتمام مهلتش از خونه بلند نشه، مالک میتونه به ازای هر روز به عنوان جریمه ازش بگیره."
              />

              <InputNumberField
                required
                suffix="تومان"
                decimalSeparator="/"
                placeholder="2,000,000"
                label="وجه التزام از موجر"
                name="landlord_penalty_fee"
                helperText="* مبلغی که اگر مالک قرض الحسنه مستاجر رو به موقع برنگردونه مستاجر میتونه به ازای هر روز به عنوان خسارت ازش بگیره."
              />

              <BottomCTA>
                <Button
                  className="w-full"
                  type="submit"
                  loading={patchDatesAndPenaltiesMutation.isPending}
                >
                  ذخیره و ادامه
                </Button>
              </BottomCTA>
            </Form>
          )}
        </LoadingAndRetry>
      </div>

      <Modal open={showAlert} className="!p-4 w-96 max-w-full" onClose={() => setShowAlert(false)}>
        <div className="flex flex-col items-center gap-4">
          <div className="text-rust-600">
            <InfoIcon size={70} />
          </div>
          <div className="text-center text-sm">
            یادت باشه اگه تاریخ قراردادت رو تغییر بدی تمام قسط هایی که تعریف کردی حذف میشن و دوباره
            از اول باید قسط تعریف کنی!
          </div>
          <div className="flex w-full gap-2 p-1 mt-4">
            <Button className="w-full" onClick={handleConfirmChangeDate}>
              تغییر می‌دم!
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowAlert(false)}>
              بازگشت
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default DateInformationPage
