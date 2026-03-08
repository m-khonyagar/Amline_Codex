import { DataTable } from '@/components/ui/DataTable'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toaster'
import { SendInvoiceLink } from '@/features/custom-invoice'
import { cn } from '@/utils/dom'
import { useMemo, useState } from 'react'
import { useGetPRContractPayments } from '../../api/get-pr-contract-payments'
import { useGetPaymentLink } from '../../api/send-payment-link'
import PRContractPaymentDelete from '../PRContractPayments/PRContractPaymentDelete'
import PRContractPaymentView from '../PRContractPayments/PRContractPaymentView'
import { generateColumns } from './columns'
import PRContractPaymentListFilters from './PRContractPaymentListFilters'
import ApplyPromoCodeForm from './ApplyPromoCodeForm'
import { InvoiceItemType } from '@/data/enums/invoice_enums'

const PRContractPaymentList = ({ contractId, className }) => {
  const prContractPaymentsQuery = useGetPRContractPayments(contractId)
  const [selectedPaymentForView, setSelectedPaymentForView] = useState(null)
  const [selectedPaymentForDelete, setSelectedPaymentForDelete] = useState(null)
  const [paymentLinkInfo, setPaymentLinkInfo] = useState(null)
  const [selectedPaymentForPromo, setSelectedPaymentForPromo] = useState(null)

  const [filters, setFilters] = useState([])

  const getPaymentLink = useGetPaymentLink()

  const handleFilterChange = (params) => {
    const newFilters = JSON.parse(params.filters)
    setFilters(newFilters ?? [])
  }

  const payments = useMemo(() => {
    const data = prContractPaymentsQuery.data || []
    const typeFilter = filters.find((f) => f.id == 'type')

    if (typeFilter?.value?.trim()) {
      return data.filter((payment) => payment.type === typeFilter.value)
    }
    {
      return data
    }
  }, [filters, prContractPaymentsQuery.data])

  const handleGetPaymentLink = (payment) => {
    const invoiceId = payment?.invoice?.id

    if (!invoiceId) {
      toast.error('هنوز فاکتوری برای این قرارداد صادر نشده.')
      return
    }

    getPaymentLink.mutate(
      {
        invoice_id: invoiceId,
        bank_gateway: 'PARSIAN',
      },
      {
        onSuccess: ({ data }) => {
          setPaymentLinkInfo({ link: data?.message, invoiceId })
          toast.success('لینک پرداخت ساخته شد.')
        },
        onError: () => {
          toast.error('ساخت لینک پرداخت با خطا مواجه شد.')
        },
      }
    )
  }

  const handleOpenPromoDialog = (payment) => {
    const invoiceId = payment?.invoice?.id

    if (!invoiceId) {
      toast.error('برای این پرداخت فاکتور فعالی ثبت نشده است.')
      return
    }

    setSelectedPaymentForPromo(payment)
  }

  return (
    <div className={cn(className)}>
      <h2 className="text-lg font-semibold mb-4">لیست پرداخت‌ها</h2>
      <DataTable
        columns={generateColumns({
          onView: (row) => setSelectedPaymentForView(row),
          onDelete: (row) => setSelectedPaymentForDelete(row),
          onSend: (row) => handleGetPaymentLink(row),
          onApplyPromo: (row) => handleOpenPromoDialog(row),
        })}
        data={payments}
        className="bg-white fa"
        showPagination={false}
        showViewOptions={false}
        noResultMessage="پرداختی ثبت نشده است."
        isLoading={prContractPaymentsQuery.isFetching}
        filtersComponent={PRContractPaymentListFilters}
        onChange={handleFilterChange}
        onRowDoubleClick={(_, row) => setSelectedPaymentForView(row.original)}
        onRefresh={() => prContractPaymentsQuery.refetch()}
      />

      <Dialog
        title="اطلاعات پرداخت"
        closeOnBackdrop={false}
        open={selectedPaymentForView}
        onOpenChange={(s) => setSelectedPaymentForView(s)}
      >
        <PRContractPaymentView
          payment={selectedPaymentForView}
          onBack={() => setSelectedPaymentForView(null)}
        />
      </Dialog>

      <Dialog
        title="حذف پرداخت"
        closeOnBackdrop={false}
        open={selectedPaymentForDelete}
        onOpenChange={(s) => setSelectedPaymentForDelete(s)}
      >
        <PRContractPaymentDelete
          payment={selectedPaymentForDelete}
          onCancel={() => setSelectedPaymentForDelete(null)}
          onSuccess={() => setSelectedPaymentForDelete(null)}
        />
      </Dialog>

      <Dialog
        open={paymentLinkInfo}
        title="ارسال لینک پرداخت"
        onOpenChange={(s) => setPaymentLinkInfo(s)}
      >
        <SendInvoiceLink
          data={{ invoice_link: paymentLinkInfo?.link, invoice_id: paymentLinkInfo?.invoiceId }}
          onCancel={() => setPaymentLinkInfo(null)}
          onSuccess={() => setPaymentLinkInfo(null)}
        />
      </Dialog>

      <Dialog
        open={!!selectedPaymentForPromo}
        title="اعمال کد تخفیف"
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedPaymentForPromo(null)
          }
        }}
      >
        <ApplyPromoCodeForm
          invoiceId={selectedPaymentForPromo?.invoice?.id}
          discountItemId={
            selectedPaymentForPromo?.invoice?.items?.find(
              (item) => item.type === InvoiceItemType.DISCOUNT
            )?.id
          }
          onCancel={() => setSelectedPaymentForPromo(null)}
          onApplied={() => {
            prContractPaymentsQuery.refetch()
            setSelectedPaymentForPromo(null)
          }}
        />
      </Dialog>
    </div>
  )
}

export default PRContractPaymentList
