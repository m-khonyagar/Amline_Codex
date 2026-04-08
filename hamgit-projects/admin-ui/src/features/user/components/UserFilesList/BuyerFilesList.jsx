import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetUserInfo } from '../../api/get-user-info'
import { generateBuyerColumns } from './columns'
import { DataTable } from '@/components/ui/DataTable'
import { useGetTenantFiles } from '@/features/market'

export const BuyerFilesList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const buyerFilesQuery = useGetTenantFiles(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      mobile: user?.mobile || null,
      listing_type: 'SALE',
    },
    { enabled: !!user?.mobile }
  )

  return (
    <DataTable
      columns={generateBuyerColumns()}
      className="border-none"
      data={buyerFilesQuery.data?.data || []}
      isLoading={buyerFilesQuery.isFetching}
      rowCount={buyerFilesQuery.data?.total_count}
      initialPagination={pagination}
      onChange={updateQueryParams}
      showViewOptions={false}
      onRowDoubleClick={(_, row) => navigate(`/market/buy-sell/buyer/${row.original.id}`)}
    />
  )
}
