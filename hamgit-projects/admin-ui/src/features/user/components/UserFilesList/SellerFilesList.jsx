import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetUserInfo } from '../../api/get-user-info'
import { generateSellerColumns } from './columns'
import { DataTable } from '@/components/ui/DataTable'
import { useGetLandlordFiles } from '@/features/market'

export const SellerFilesList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const sellerFilesQuery = useGetLandlordFiles(
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
      columns={generateSellerColumns()}
      className="border-none"
      data={sellerFilesQuery.data?.data || []}
      isLoading={sellerFilesQuery.isFetching}
      rowCount={sellerFilesQuery.data?.total_count}
      initialPagination={pagination}
      onChange={updateQueryParams}
      showViewOptions={false}
      onRowDoubleClick={(_, row) => navigate(`/market/buy-sell/seller/${row.original.id}`)}
    />
  )
}
