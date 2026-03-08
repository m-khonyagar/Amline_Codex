import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import Invoice from '../components/Invoice'
import { handleErrorOnSubmit, handleErrorPage } from '@/utils/error'
import Button from '@/components/ui/Button'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { InvoiceStatusEnums } from '@/data/enums/invoice_status_enums'
import useBankGateway from '../api/bank-gateway'
import useGetContractCommissionInvoice from '../api/get-contract-commission-invoice'
import { bankGatewayEnums } from '@/features/contract'
import useGetInvoice from '../api/get-invoice'
import DrawerModal from '@/components/ui/DrawerModal'
import { Form, InputField, useForm } from '@/components/ui/Form'
import useApplyDiscountCode from '../api/apply-discount-code'

function InvoicePage() {
  const router = useRouter()
  // This page is used in two different routes — one provides a contractId, and the other an invoiceId.
  const { contractId, invoiceId } = router.query
  const getBankGateway = useBankGateway()
  const invoiceQuery = useGetInvoice(invoiceId)
  const contractCommissionInvoiceQuery = useGetContractCommissionInvoice(contractId, {
    enabled: router.isReady && !!contractId,
  })

  const realInvoiceQuery = contractId ? contractCommissionInvoiceQuery : invoiceQuery

  const { data: invoice } = realInvoiceQuery

  const isSuccess = useMemo(() => invoice?.status?.id === InvoiceStatusEnums.PAID, [invoice])

  const submitInvoiceContract = () => {
    getBankGateway.mutate(
      {
        invoice_id: invoice?.id,
        bank_gateway: bankGatewayEnums.PARSIAN,
      },
      {
        onSuccess: (res) => {
          if (res.data.success) {
            router.push(res?.data?.message)
          }
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  if (contractCommissionInvoiceQuery.error) {
    handleErrorPage(contractCommissionInvoiceQuery.error)
  }

  const [methodModal, setMethodModal] = useState(false)
  const [showdiscount, setShowdiscount] = useState(false)
  const applyDiscountCodeMutation = useApplyDiscountCode(contractId)
  const methods = useForm({
    defaultValues: {
      promo_code: '',
    },
  })
  const handleDiscountCode = (data, { setError }) => {
    applyDiscountCodeMutation.mutate(
      {
        promo_code: data.promo_code,
        invoice_id: invoice?.id,
      },
      {
        onSuccess: () => {
          realInvoiceQuery?.refetch()
          setShowdiscount(!showdiscount)
        },
        onError: (err) => {
          handleErrorOnSubmit(err, setError, data)
        },
      }
    )
  }

  return (
    <>
      <HeaderNavigation title="پرداخت کمیسیون" />

      <div className="my-auto px-6 ">
        <div className=" mb-32 shadow-lg rounded-2xl">
          <LoadingAndRetry query={realInvoiceQuery} checkRefetching>
            <Invoice
              invoice={invoice}
              contractId={contractId}
              onSubmit={submitInvoiceContract}
              loading={getBankGateway.isPending}
              query={realInvoiceQuery}
              showDiscount={setShowdiscount}
            />
          </LoadingAndRetry>
        </div>
      </div>
      <div className="w-full  h-20 flex justify-center items-center">
        {isSuccess ? (
          <div className="flex justify-center font-bold text-teal-600">
            این صورت حساب پرداخت شده است
          </div>
        ) : (
          <BottomCTA>
            <Button
              className="w-full"
              onClick={() => setMethodModal(true)}
              loading={getBankGateway.isPending}
            >
              پرداخت
            </Button>
          </BottomCTA>
        )}
      </div>
      <DrawerModal show={showdiscount} handleClose={() => setShowdiscount(false)} pure>
        <div className="w-[300px] mx-auto max-w-full p-5" dir="rtl">
          <Form
            methods={methods}
            onSubmit={handleDiscountCode}
            className="flex flex-col justify-between text-lrighteft"
          >
            <p className="text-right font-bold">ثبت کد تخفیف </p>
            <InputField
              required
              name="promo_code"
              className="w-full mt-2"
              placeholder="وارد کنید"
              error={!!applyDiscountCodeMutation.error}
            />
            <Button
              className="w-full"
              type="submit"
              // className="h-11 ml-0"
              loading={applyDiscountCodeMutation.isPending}
            >
              بررسی کد
            </Button>
          </Form>
        </div>
      </DrawerModal>
      <DrawerModal
        show={methodModal}
        modalHeader="پرداخت"
        handleClose={() => setMethodModal(false)}
      >
        <div className="w-[300px] mx-auto max-w-full">
          <Button variant="outline" className="w-full mb-6" onClick={() => submitInvoiceContract()}>
            پرداخت آنلاین
          </Button>
          <Button className="w-full" href={`/invoice/p/${invoice?.id}/wallet`}>
            پرداخت با کیف پول
          </Button>
        </div>
      </DrawerModal>
    </>
  )
}

export default InvoicePage
