import { useState, useMemo } from 'react'
import SegmentedControl from '@/components/ui/SegmentedControl'
import { HeaderNavigation } from '@/features/app'
import useGetUserPayments from '../api/get-user-payments'
import ReceiptCardSkeleton from '../components/ReceiptCardSkeleton'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import ReceiptCard from '../components/ReceiptCard'
import InfiniteButton from '@/components/InfiniteButton'
import { PaymentStatusEnums } from '@/data/enums/payment_status_enums'
import { PaymentSideEnums } from '@/data/enums/payment_side_enums'

const filterOptions = [
  {
    value: 2,
    paymentSide: PaymentSideEnums.PAYEE,
    label: 'رسیدهای دریافتی',
    statuses: [PaymentStatusEnums.PAID],
  },
  {
    value: 1,
    paymentSide: PaymentSideEnums.PAYER,
    label: 'رسیدهای پرداختی',
    statuses: [PaymentStatusEnums.PAID, PaymentStatusEnums.CANCELLED],
  },
]

function ProfilePaymentsPage() {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[1])

  const userPaymentsQuery = useGetUserPayments({
    limit: 10,
    paymentSide: selectedFilter.paymentSide,
  })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = userPaymentsQuery

  const payments = useMemo(
    () => (data?.pages || []).flatMap((page) => page?.data?.data || []),
    [data]
  )

  return (
    <>
      <HeaderNavigation title="پرداخت های من" />

      <div className="flex-grow p-4 flex flex-col gap-5">
        <SegmentedControl
          name="filter"
          segments={filterOptions}
          value={selectedFilter}
          onChange={(val) => setSelectedFilter(val)}
        />

        <LoadingAndRetry query={userPaymentsQuery} loadingComponent={ReceiptCardSkeleton}>
          {!userPaymentsQuery.isLoading && payments.length === 0 && (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              <div className="mb-16">
                {selectedFilter.paymentSide === PaymentSideEnums.PAYER
                  ? 'هنوز پرداختی نداشتی!'
                  : 'هنوز دریافتی نداشتی!'}
              </div>
            </div>
          )}

          {payments.map((payment) => (
            <ReceiptCard key={payment.id} payment={payment} />
          ))}

          <InfiniteButton
            onLoad={() => fetchNextPage()}
            disabled={!hasNextPage}
            loading={isFetchingNextPage}
          />
        </LoadingAndRetry>
      </div>
    </>
  )
}

export default ProfilePaymentsPage
