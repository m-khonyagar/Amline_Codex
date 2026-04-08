import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetUserInfo } from '../../api/get-user-info'
import { generateRealtorColumns } from './columns'
import { DataTable } from '@/components/ui/DataTable'
import { useGetRealtorFiles } from '@/features/market'

export const RealtorFilesList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const realtorFilesQuery = useGetRealtorFiles(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      mobile: user?.mobile || null,
    },
    { enabled: !!user?.mobile }
  )

  return (
    <DataTable
      columns={generateRealtorColumns()}
      className="border-none"
      data={realtorFilesQuery.data?.data || []}
      isLoading={realtorFilesQuery.isFetching}
      rowCount={realtorFilesQuery.data?.total_count}
      initialPagination={pagination}
      onChange={updateQueryParams}
      showViewOptions={false}
      onRowDoubleClick={(_, row) => navigate(`/market/realtor/${row.original.id}`)}
    />
  )
}
