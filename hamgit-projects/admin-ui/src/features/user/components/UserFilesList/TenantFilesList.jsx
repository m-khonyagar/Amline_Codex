import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetUserInfo } from '../../api/get-user-info'
import { generateTenantColumns } from './columns'
import { DataTable } from '@/components/ui/DataTable'
import { useGetTenantFiles } from '@/features/market'

export const TenantFilesList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const tenantFilesQuery = useGetTenantFiles(
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
      columns={generateTenantColumns()}
      className="border-none"
      data={tenantFilesQuery.data?.data || []}
      isLoading={tenantFilesQuery.isFetching}
      rowCount={tenantFilesQuery.data?.total_count}
      initialPagination={pagination}
      onChange={updateQueryParams}
      showViewOptions={false}
      onRowDoubleClick={(_, row) => navigate(`/market/deposit-rent/tenant/${row.original.id}`)}
    />
  )
}
