import { cn } from '@/utils/dom'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetPromoCodes } from '../../api/get-promo-codes'

export const PromoCodesList = ({ className }) => {
  const { pagination, updateQueryParams } = useDataTableQueryParams()

  const promoCodesQuery = useGetPromoCodes({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
  })

  return (
    <DataTable
      columns={generateColumns()}
      className={cn('bg-white', className)}
      onRefresh={() => promoCodesQuery.refetch()}
      data={promoCodesQuery.data?.data || []}
      isLoading={promoCodesQuery.isFetching}
      rowCount={promoCodesQuery.data?.total_count}
      initialPagination={pagination}
      onChange={updateQueryParams}
    />
  )
}
