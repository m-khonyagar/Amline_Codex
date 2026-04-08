import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetPromoCodes } from '@/features/promo-codes'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import { useParams } from 'react-router-dom'
import { useGetUserInfo } from '../../api/get-user-info'

export const UserDiscountsList = () => {
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const promoCodesQuery = useGetPromoCodes(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      mobile: user?.mobile || null,
    },
    { enabled: !!user?.mobile }
  )

  return (
    <div className="bg-white rounded-2xl p-2">
      <DataTable
        columns={generateColumns()}
        className="border-none"
        onRefresh={() => promoCodesQuery.refetch()}
        data={promoCodesQuery.data?.data || []}
        isLoading={promoCodesQuery.isFetching}
        rowCount={promoCodesQuery.data?.total_count}
        initialPagination={pagination}
        onChange={updateQueryParams}
      />
    </div>
  )
}
