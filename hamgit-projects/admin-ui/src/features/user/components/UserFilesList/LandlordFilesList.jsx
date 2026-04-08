import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetUserInfo } from '../../api/get-user-info'
import { generateLandlordColumns } from './columns'
import { DataTable } from '@/components/ui/DataTable'
import { useGetLandlordFiles } from '@/features/market'

export const LandlordFilesList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const landlordFilesQuery = useGetLandlordFiles(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      mobile: user?.mobile || null,
      listing_type: 'RENT',
    },
    { enabled: !!user?.mobile }
  )

  return (
    <DataTable
      columns={generateLandlordColumns()}
      className="border-none"
      data={landlordFilesQuery.data?.data || []}
      isLoading={landlordFilesQuery.isFetching}
      rowCount={landlordFilesQuery.data?.total_count}
      initialPagination={pagination}
      onChange={updateQueryParams}
      showViewOptions={false}
      onRowDoubleClick={(_, row) => navigate(`/market/deposit-rent/landlord/${row.original.id}`)}
    />
  )
}
