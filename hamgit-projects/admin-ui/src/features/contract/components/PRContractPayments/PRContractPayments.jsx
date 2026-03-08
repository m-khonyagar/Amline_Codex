import { useState } from 'react'
import { cn } from '@/utils/dom'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toaster'
import { numberSeparator } from '@/utils/number'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { paymentType, paymentTypeOptions } from '@/data/enums/prcontract-enums'
import PRContractPaymentCreation from './PRContractPaymentCreation'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import PRContractEditBasePaymentAmount from './PRContractEditBasePaymentAmount'
import useFinalizePRContractPayment from '../../api/finalize-pr-contract-payment'
import PRContractPaymentList from '../PRContractPaymentList/PRContractPaymentList'
import { useGetPRContractSummaryPayments } from '../../api/get-pr-contract-summary-payments'
import { useCreatePRContractInvoice } from '../../api/create-pr-contract-invoice'
import PRContractMonthlyRentPaymentCreation from './PRContractMonthlyRentPaymentCreation'
import {
  PlusIcon,
  PencilIcon,
  CheckDoubleIcon,
  DocumentEditIcon,
  CircleLoadingIcon,
} from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu'
import { handleErrorOnSubmit } from '@/utils/error'
import { translateEnum } from '@/utils/enum'

const PRContractPayments = ({ contractId }) => {
  const [editPayment, setEditPayment] = useState(null)
  const [isOpenActions, setIsOpenActions] = useState(false)

  const [isOpenPaymentDialog, setIsOpenPaymentDialog] = useState(false)
  const [isOpenMonthlyPaymentCreationDialog, setIsOpenMonthlyPaymentCreationDialog] =
    useState(false)

  const prContractQuery = useGetPRContractInfo(contractId)
  const prContractSummaryPaymentsQuery = useGetPRContractSummaryPayments(contractId)
  const finalizePaymentsMutation = useFinalizePRContractPayment(contractId)

  const prContractInvoiceMutate = useCreatePRContractInvoice(contractId, {
    onSuccess: () => toast.success('فاکتور جدید برای پرداخت های این قرارداد ایجاد شد.'),
  })

  const prContract = prContractQuery.data
  const summary = prContractSummaryPaymentsQuery.data

  const isRentAndDepositSet = !!prContract?.deposit_amount && !!prContract?.monthly_rent_amount

  const toggleIsOpenActions = (s) => {
    if (finalizePaymentsMutation.isPending) {
      return
    }

    setIsOpenActions(s)
  }

  const finalizePayments = (e, paymentType) => {
    e.preventDefault()

    finalizePaymentsMutation.mutate(
      { payment_type: paymentType },
      {
        onSuccess: () => {
          toast.success(
            `پرداخت‌های ${translateEnum(paymentTypeOptions, paymentType)} با موفقیت نهایی شد.`
          )
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
        onSettled: () => {
          toggleIsOpenActions(false)
        },
      }
    )
  }

  return (
    <div>
      <LoadingAndRetry query={[prContractQuery]} checkRefetching>
        {editPayment ? (
          <div className="mx-auto max-w-2xl">
            <PRContractPaymentCreation
              payment={editPayment}
              contractId={contractId}
              onCancel={() => setEditPayment(null)}
              onSuccess={() => setEditPayment(null)}
            />
          </div>
        ) : (
          <>
            {prContract && (
              <>
                <div>
                  <DropdownMenu open={isOpenActions} onOpenChange={(s) => toggleIsOpenActions(s)}>
                    <DropdownMenuTrigger asChild>
                      <button className="mr-auto text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2">
                        <PencilIcon size={16} />
                        عملیات
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent dir="rtl" align="end">
                      <DropdownMenuItem
                        disabled={finalizePaymentsMutation.isPending}
                        onClick={() => setIsOpenPaymentDialog(true)}
                      >
                        <DocumentEditIcon size={16} />
                        تنظیم پیش پرداخت و اجاره
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        disabled={!isRentAndDepositSet || finalizePaymentsMutation.isPending}
                        onClick={() => setEditPayment(true)}
                      >
                        <PlusIcon size={16} />
                        ایجاد پرداخت
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => prContractInvoiceMutate.mutate()}>
                        <PlusIcon size={16} />
                        ایجاد فاکتور (دستی)
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        disabled={!isRentAndDepositSet || finalizePaymentsMutation.isPending}
                        onClick={() => setIsOpenMonthlyPaymentCreationDialog(true)}
                      >
                        <PlusIcon size={16} />
                        {prContract?.rent_day ? 'ویرایش' : 'ایجاد'} پرداخت اجاره ماهیانه
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        disabled={finalizePaymentsMutation.isPending}
                        onClick={(e) => finalizePayments(e, paymentType.DEPOSIT)}
                      >
                        {finalizePaymentsMutation.isPending &&
                        finalizePaymentsMutation.variables?.payment_type == paymentType.DEPOSIT ? (
                          <CircleLoadingIcon size={16} className="animate-spin" />
                        ) : (
                          <CheckDoubleIcon size={16} />
                        )}
                        نهایی کردن پرداخت های رهن
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        disabled={finalizePaymentsMutation.isPending}
                        onClick={(e) => finalizePayments(e, paymentType.RENT)}
                      >
                        {finalizePaymentsMutation.isPending &&
                        finalizePaymentsMutation.variables?.payment_type == paymentType.RENT ? (
                          <CircleLoadingIcon size={16} className="animate-spin" />
                        ) : (
                          <CheckDoubleIcon size={16} />
                        )}
                        نهایی کردن پرداخت های اجاره
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 py-4 flex flex-wrap bg-white rounded-lg fa">
                  <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-2">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-700">مبلغ رهن:</div>
                      <div className="mr-auto">
                        {prContract.deposit_amount ? (
                          <>
                            {numberSeparator(prContract.deposit_amount)}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </>
                        ) : (
                          <span className="text-sm text-red-600">تنظیم نشده است</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="text-sm text-gray-700">
                        مجموع پرداخت‌های ثبت شده برای رهن:
                      </div>
                      <div className="mr-auto">
                        {summary?.total_deposit_payments ? (
                          <div
                            className={cn(
                              prContract.deposit_amount != summary.total_deposit_payments
                                ? ''
                                : 'text-green-600'
                            )}
                          >
                            {numberSeparator(summary.total_deposit_payments)}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">تنظیم نشده است</span>
                        )}
                      </div>
                    </div>

                    {summary?.total_deposit_payments &&
                      prContract.deposit_amount != summary.total_deposit_payments && (
                        <div className="flex items-center">
                          <div className="text-sm text-gray-700">
                            اختلاف مبلغ رهن با پرداخت‌های ثبت شده:
                          </div>

                          <div className="mr-auto text-red-600">
                            {numberSeparator(
                              prContract.deposit_amount - summary.total_deposit_payments
                            )}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </div>
                        </div>
                      )}

                    <hr />

                    <div className="flex items-center bg-gray-100 rounded-md p-2">
                      <div className="text-sm text-gray-700 ">پرداخت های رهن نهایی:</div>
                      <div className="mr-auto">
                        {summary?.deposit_finalized ? (
                          <span className="text-green-600">شده است</span>
                        ) : (
                          <span className="text-red-600">نشده است</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-2 md:border-r">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-700">مبلغ اجاره ماهیانه:</div>
                      <div className="mr-auto">
                        {prContract.monthly_rent_amount ? (
                          <>
                            {numberSeparator(prContract.monthly_rent_amount)}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </>
                        ) : (
                          <span className="text-sm text-red-600">تنظیم نشده است</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="text-sm text-gray-700">کل مبلغ اجاره:</div>
                      <div className="mr-auto">
                        {prContract.total_rent_amount ? (
                          <>
                            {numberSeparator(prContract.total_rent_amount)}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </>
                        ) : (
                          <span className="text-sm text-red-600">تنظیم نشده است</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="text-sm text-gray-700">
                        مجموع پرداخت‌های ثبت شده برای اجاره:
                      </div>
                      <div className="mr-auto">
                        {summary?.total_rent_payments ? (
                          <div
                            className={cn(
                              prContract.total_rent_amount != summary.total_rent_payments
                                ? ''
                                : 'text-green-600'
                            )}
                          >
                            {numberSeparator(summary.total_rent_payments)}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">تنظیم نشده است</span>
                        )}
                      </div>
                    </div>

                    {summary?.total_rent_payments &&
                      prContract.total_rent_amount != summary.total_rent_payments && (
                        <div className="flex items-center">
                          <div className="text-sm text-gray-700">
                            اختلاف مبلغ اجاره با پرداخت‌های ثبت شده:
                          </div>

                          <div className="mr-auto text-red-600">
                            {numberSeparator(
                              prContract.total_rent_amount - summary.total_rent_payments
                            )}
                            <span className="text-sm text-gray-500 mr-1">تومان</span>
                          </div>
                        </div>
                      )}

                    <hr />

                    <div className="flex items-center bg-gray-100 rounded-md p-2">
                      <div className="text-sm text-gray-700 ">پرداخت های اجاره نهایی:</div>
                      <div className="mr-auto">
                        {summary?.rent_finalized ? (
                          <span className="text-green-600">شده است</span>
                        ) : (
                          <span className="text-red-600">نشده است</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <PRContractPaymentList contractId={contractId} className="mt-4" />
          </>
        )}
      </LoadingAndRetry>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenPaymentDialog}
        onOpenChange={(s) => setIsOpenPaymentDialog(s)}
        title="تنظیم پیش پرداخت و اجاره"
      >
        <PRContractEditBasePaymentAmount
          prContract={prContract}
          onCancel={() => setIsOpenPaymentDialog(false)}
          onSuccess={() => setIsOpenPaymentDialog(false)}
        />
      </Dialog>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenMonthlyPaymentCreationDialog}
        onOpenChange={(s) => setIsOpenMonthlyPaymentCreationDialog(s)}
        title={`${prContract?.rent_day ? 'ویرایش' : 'ایجاد'} پرداخت اجاره ماهیانه`}
      >
        <PRContractMonthlyRentPaymentCreation
          prContract={prContract}
          onCancel={() => setIsOpenMonthlyPaymentCreationDialog(false)}
          onSuccess={() => setIsOpenMonthlyPaymentCreationDialog(false)}
        />
      </Dialog>
    </div>
  )
}

export default PRContractPayments
