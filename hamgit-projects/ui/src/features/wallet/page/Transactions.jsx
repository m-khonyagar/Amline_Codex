import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import InfiniteButton from '@/components/InfiniteButton'
import useGetWalletTransactions from '../api/get-transactions'
import WalletReceiptCard from '../components/WalletReceiptCard'

export default function Transactions() {
  const query = useGetWalletTransactions()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = query

  const transactions = useMemo(
    () => (data?.pages || []).flatMap((page) => page?.data?.data || []),
    [data]
  )

  return (
    <>
      <HeaderNavigation title="صورتحساب" />

      <div className="flex-grow p-6 flex flex-col gap-5 pb-32">
        <LoadingAndRetry query={query} skeletonItemHeight={160}>
          {!query.isPending && transactions.length === 0 && (
            <div className="flex-grow flex items-center justify-center text-gray-500">
              <div className="mb-16">تا به حال از کیف پول استفاده نکردی!</div>
            </div>
          )}

          {transactions.map((transaction) => (
            <WalletReceiptCard key={transaction.id} transaction={transaction} />
          ))}

          <InfiniteButton
            onLoad={() => fetchNextPage()}
            disabled={!hasNextPage}
            loading={isFetchingNextPage}
          />
        </LoadingAndRetry>

        <BottomCTA>
          <Button href="/wallet" type="button" className="w-full">
            کیف پول
          </Button>
        </BottomCTA>
      </div>
    </>
  )
}
