import { createElement, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { format } from 'date-fns-jalali'
import { cn } from '@/utils/dom'
import Fab from '@/components/ui/Fab'
import Button from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'
import CollapseBox from '@/components/ui/CollapseBox'
import InputNumber from '@/components/ui/InputNumber'
import { handleErrorOnSubmit } from '@/utils/error'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import {
  paymentMethodEnumTranslation,
  prContractPaymentTypeEnum,
  useContractLogic,
  useGetContract,
} from '@/features/contract'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import { numberSeparator, numberToPersianWords } from '@/utils/number'
import WrapperCard from '../../../components/WrapperCard'
import useDeletePayment from '../../../api/delete-payment'
import PaymentCashForm from '../../../components/PaymentCashForm'
import PaymentMethodItem from '../../../components/PaymentMethodItem'
import PaymentChequeForm from '../../../components/PaymentChequeForm'
import useGetContractPayments from '../../../api/get-contract-payments'
import useCompleteContractPayment from '../../../api/complete-contract-payment'
import PaymentMonthlyForm from '../../../components/PaymentMonthlyForm'
import { paymentFormTypeEnum, paymentFormTypeOptions } from '../../../constants'
import useBack from '@/hooks/use-back'
import usePatchPrContractsDeposit from '../../../api/patch-pr-contracts-deposit'
import usePatchPrContractsMonthlyRent from '../../../api/patch-pr-contracts-monthly-rent'
import { paymentCategoryEnum } from '@/data/enums/payment_category_enums'
import useGetContractStatus from '../../../api/get-contract-status'
import { getPaymentSteps } from '../../../libs/payment-steps'
import { getDateAndPaymentSteps } from '../../../libs/date-payment-steps'
import { getDateDifference } from '../../../utils/date'

const paymentPageTypes = [
  {
    id: paymentCategoryEnum.DEPOSIT,
    pagePath: '/mortgage',
    pageTitle: 'رهن (قرض الحسنه)',
    title: 'رهن',
    amountPlaceholder: '200,000,000',
    amountKey: 'deposit_amount',
    paymentType: prContractPaymentTypeEnum.DEPOSIT,
    pathMutation: usePatchPrContractsDeposit,
  },
  {
    id: paymentCategoryEnum.RENT,
    pagePath: '/rental',
    pageTitle: 'اجاره',
    title: 'اجاره ماهیانه',
    amountPlaceholder: '3,000,000',
    amountKey: 'monthly_rent_amount',
    paymentType: prContractPaymentTypeEnum.RENT,
    pathMutation: usePatchPrContractsMonthlyRent,
  },
]

const priceFormTypes = {
  [paymentFormTypeEnum.CASH]: {
    edit: PaymentCashForm,
  },
  [paymentFormTypeEnum.CHEQUE]: {
    edit: PaymentChequeForm,
  },
  [paymentFormTypeEnum.MONTHLY]: {
    edit: PaymentMonthlyForm,
  },
}

const calcBack = (statuses, contractId) => {
  const isCompletedAllSteps = statuses
    ? getDateAndPaymentSteps(statuses).every((s) => s.completed)
    : false
  const isCompletedPaymentSteps = statuses
    ? getPaymentSteps(statuses).every((s) => s.completed)
    : false

  // eslint-disable-next-line no-nested-ternary
  const link = isCompletedPaymentSteps
    ? isCompletedAllSteps
      ? `/contracts/${contractId}/manage`
      : `/contracts/${contractId}/manage/date-payment`
    : `/contracts/${contractId}/manage/date-payment/payment`

  return {
    url: link,
    // eslint-disable-next-line no-nested-ternary
    count: isCompletedAllSteps ? 3 : isCompletedPaymentSteps ? 2 : 1,
  }
}

function PaymentInformationPage() {
  const router = useRouter()
  const { contractId } = router.query

  const { goBack } = useBack()
  const contractQuery = useGetContract(contractId, { enabled: router.isReady })
  const contractPaymentsQuery = useGetContractPayments(contractId, { enabled: router.isReady })
  const deletePaymentMutation = useDeletePayment()

  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery
  const { signedByCurrentUser } = useContractLogic(statuses)

  const backUrl = useMemo(() => calcBack(statuses, contractId).url, [contractId, statuses])
  const handleBack = (data) => {
    const { url, count } = calcBack(data || statuses, contractId)
    goBack(url, count)
  }

  const pageType = useMemo(
    () => paymentPageTypes.find((p) => router.pathname.includes(p.pagePath)),
    [router.pathname]
  )

  const patchMutation = pageType.pathMutation(contractId)

  const [amount, setAmount] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [selectedInstallmentData, setSelectedInstallmentData] = useState(null)

  const installments = useMemo(
    () =>
      (contractPaymentsQuery.data || [])
        .filter((p) => pageType.paymentType === p.type)
        .sort((a, b) => (a.due_date > b.due_date ? 1 : -1)),
    [contractPaymentsQuery.data, pageType]
  )

  const isMonthly = useMemo(() => installments.some((i) => i.is_bulk), [installments])

  const contractDuration = useMemo(() => {
    return getDateDifference(contractQuery.data?.start_date, contractQuery.data?.end_date)
  }, [contractQuery.data?.start_date, contractQuery.data?.end_date])
  const totalMonth = contractDuration.years * 12 + contractDuration.months

  const totalInstallmentsPrice = useMemo(() => {
    return installments.reduce((total, item) => total + Number(item.amount), 0)
  }, [installments])

  const rentAmountOverflow = totalInstallmentsPrice > contractQuery.data?.total_rent_amount
  const depositAmountOverflow = totalInstallmentsPrice > contractQuery.data?.deposit_amount

  const remainingAmount = useMemo(() => {
    if (pageType.id === paymentCategoryEnum.RENT) {
      return (contractQuery.data?.total_rent_amount || 0) - totalInstallmentsPrice
    }
    return Number(amount) - totalInstallmentsPrice
  }, [amount, contractQuery.data?.total_rent_amount, pageType.id, totalInstallmentsPrice])

  const completePaymentsMutation = useCompleteContractPayment(contractId, pageType.paymentType)

  const toggleMenu = () => {
    if (amount === '') {
      toast.error(`هنوز مبلغ ${pageType.title} رو مشخص نکردی!`)
      return
    }

    setShowMenu((prevState) => !prevState)
  }

  const installmentsOptions = useMemo(() => {
    if (installments.length > 0 && remainingAmount === 0) {
      return []
    }

    if (pageType.paymentType === prContractPaymentTypeEnum.DEPOSIT) {
      return paymentFormTypeOptions.filter((o) => o.value !== paymentFormTypeEnum.MONTHLY)
    }

    if (pageType.paymentType === prContractPaymentTypeEnum.RENT) {
      if (installments.length > 0) {
        if (isMonthly) {
          return []
        }

        return paymentFormTypeOptions.filter((o) => o.value !== paymentFormTypeEnum.MONTHLY)
      }

      return paymentFormTypeOptions
    }

    return []
  }, [installments, pageType.paymentType, isMonthly, remainingAmount])

  const monthlyInstallments = useMemo(() => {
    if (!isMonthly || installments.length < 0) return {}
    return installments.length > 1 ? installments[1] : installments[0]
  }, [isMonthly, installments])

  const handleNewInstallment = (formTypeOption) => {
    setSelectedInstallmentData({
      params: {
        formType: formTypeOption.value,
        method: formTypeOption.paymentMethod,
      },
      defaultValues: {},
    })
    setShowMenu(false)
  }

  const editInstallment = (payment) => {
    setSelectedInstallmentData({
      params: {
        formType: payment.is_bulk ? paymentFormTypeEnum.MONTHLY : payment.method,
        method: payment.paymentMethod,
      },
      defaultValues: payment,
    })
  }

  const [amountEditable, setAmountEditable] = useState(false)

  const tempAmount = useMemo(() => {
    return contractQuery.data?.[pageType.amountKey]
  }, [contractQuery.data, pageType])

  const handelCloseEditAmount = () => {
    setAmountEditable(false)
    setAmount(tempAmount)
  }

  const submitAmount = () => {
    if (!amount || Number(amount) === 0) {
      toast.error(`مبلغ ${pageType.title} صحیح نیست`)
      return
    }

    patchMutation.mutateAsync(
      {
        [pageType.amountKey]: amount,
      },
      {
        onSuccess: () => {
          setAmountEditable(false)
          toast.success(`مبلغ ${pageType.title} ثبت شد. الان می‌تونی قسطات رو تعریف کنی!`)
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  const handleInstallment = () => {
    setSelectedInstallmentData(null)
  }

  const handleDeleteInstallment = (payment) => {
    deletePaymentMutation.mutate(
      {
        paymentId: payment.id,
        contractId,
        paymentFormType: isMonthly ? paymentFormTypeEnum.MONTHLY : payment.method,
      },
      {
        onSuccess: () => {
          contractPaymentsQuery.refetch()
          contractStatusQuery.refetch()
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  const handleSubmit = () => {
    completePaymentsMutation.mutate(
      {},
      {
        onSuccess: () => {
          contractStatusQuery.refetch().then((res) => {
            handleBack(res.data)
          })
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  useEffect(() => {
    if (contractQuery.data?.[pageType.amountKey]) {
      setAmount(contractQuery.data[[pageType.amountKey]])
    }
  }, [contractQuery.isSuccess, contractQuery.data, pageType.amountKey])

  useEffect(() => {
    if (signedByCurrentUser) {
      router.replace(`/contracts/${contractId}`)
    }
  }, [contractId, signedByCurrentUser, router])

  const showRentHelperText =
    pageType.id === paymentCategoryEnum.RENT && contractQuery.data?.total_rent_amount > 0

  return (
    <>
      <HeaderNavigation title={pageType.pageTitle} backUrl={backUrl} />

      <div className="px-6 py-5 flex flex-col gap-6">
        <LoadingAndRetry query={contractQuery}>
          <WrapperCard>
            <InputNumber
              suffix="تومان"
              value={amount}
              decimalSeparator="/"
              name="amount"
              label={`مبلغ ${pageType.title}`}
              placeholder={pageType.amountPlaceholder}
              onValueChange={({ value }) => setAmount(value)}
              readOnly={tempAmount && !amountEditable}
              helperText={
                showRentHelperText
                  ? `مجموع اجاره ماهیانه‌ت در طول ${totalMonth} ماه ${contractDuration.days > 0 ? `و ${contractDuration.days} روز` : ''} معادل با ${numberSeparator(contractQuery.data?.total_rent_amount)} تومانه.`
                  : null
              }
              captionClassName={`!text-sm !text-gray-500 fa${showRentHelperText && ' !mb-4'}`}
            />
            <div className="flex gap-2">
              {(!tempAmount || amountEditable) && (
                <Button className="w-full" onClick={submitAmount} loading={patchMutation.isPending}>
                  ذخیره
                </Button>
              )}
              {amountEditable && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handelCloseEditAmount}
                  disabled={patchMutation.isPending}
                >
                  انصراف
                </Button>
              )}
              {tempAmount && !amountEditable && (
                <Button className="w-full" onClick={() => setAmountEditable(true)}>
                  ویرایش
                </Button>
              )}
            </div>
          </WrapperCard>

          {selectedInstallmentData &&
            createElement(priceFormTypes[selectedInstallmentData.params.formType].edit, {
              amount,
              contractId,
              onConfirm: handleInstallment,
              onCancel: () => setSelectedInstallmentData(null),
              defaultValues: selectedInstallmentData.defaultValues,
              paymentType: pageType.paymentType,
              handleDeleteInstallment,
              ...selectedInstallmentData.params,
            })}

          <LoadingAndRetry checkRefetching query={contractPaymentsQuery}>
            {!selectedInstallmentData && installmentsOptions.length > 0 && (
              <Fab open={showMenu} onOpenChange={toggleMenu}>
                {installmentsOptions.map((option) => (
                  <Fab.Item
                    key={option.label}
                    icon={option.icon}
                    label={option.label}
                    onClick={() => handleNewInstallment(option)}
                  />
                ))}
              </Fab>
            )}

            {installments.length === 0 && !selectedInstallmentData && (
              <div className="h-[500px] flex justify-center items-center">
                <div className="text-gray-500">هنوز قسطی تعریف نکردی!</div>
              </div>
            )}

            {installments.length > 0 &&
              !selectedInstallmentData &&
              (isMonthly ? (
                <WrapperCard>
                  <div className="flex flex-col gap-3 fa">
                    <div className="flex justify-between items-center">
                      <div>شیوه پرداخت:</div>
                      <div>نقدی ماهانه</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>تاریخ:</div>
                      <div>
                        {monthlyInstallments?.due_date &&
                          `${numberToPersianWords(format(monthlyInstallments.due_date, 'd'), { ordinal: true })} هر ماه`}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>مبلغ:</div>
                      <div>{numberSeparator(monthlyInstallments?.amount)} تومان</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <Button
                        type="submit"
                        onClick={() => editInstallment(monthlyInstallments)}
                        disabled={deletePaymentMutation.isPending}
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteInstallment(monthlyInstallments)}
                        loading={deletePaymentMutation.isPending}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </WrapperCard>
              ) : (
                installments.map((item, i) => (
                  <div key={item.id}>
                    <WrapperCard>
                      <CollapseBox
                        className="fa"
                        label={`قسط ${numberToPersianWords(i + 1, { ordinal: true })} - ${numberSeparator(item.amount)} تومان ${paymentMethodEnumTranslation[item.method] || ''}`}
                      >
                        <PaymentMethodItem payment={item} />

                        <div className="grid grid-cols-2 gap-3 mt-5">
                          <Button
                            type="submit"
                            onClick={() => editInstallment(item)}
                            disabled={deletePaymentMutation.isPending}
                          >
                            ویرایش
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDeleteInstallment(item)}
                            loading={deletePaymentMutation.isPending}
                          >
                            حذف
                          </Button>
                        </div>
                      </CollapseBox>
                    </WrapperCard>
                  </div>
                ))
              ))}

            {installments.length !== 0 && !selectedInstallmentData && (
              <div className="pt-5 fa">
                <WrapperCard
                  error={pageType.id === 'DEPOSIT' ? depositAmountOverflow : rentAmountOverflow}
                >
                  <div
                    className={cn('flex justify-between items-center', {
                      'text-red-600':
                        pageType.id === 'DEPOSIT' ? depositAmountOverflow : rentAmountOverflow,
                    })}
                  >
                    <div>مجموع اقساط:</div>
                    <div>{totalInstallmentsPrice.toLocaleString()} تومان</div>
                  </div>

                  {!isMonthly && remainingAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <div>مانده اقساط:</div>
                      <div>{remainingAmount.toLocaleString()} تومان</div>
                    </div>
                  )}
                </WrapperCard>
              </div>
            )}
          </LoadingAndRetry>

          {!selectedInstallmentData && (
            <BottomCTA>
              <Button
                className="w-full"
                disabled={amount === '' || installments.length === 0 || patchMutation.isPending}
                onClick={() => handleSubmit()}
                loading={completePaymentsMutation.isPending}
              >
                ذخیره و ادامه
              </Button>
            </BottomCTA>
          )}
        </LoadingAndRetry>
      </div>
    </>
  )
}

export default PaymentInformationPage
