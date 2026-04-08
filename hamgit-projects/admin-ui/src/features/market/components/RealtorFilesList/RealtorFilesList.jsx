import { useNavigate } from 'react-router-dom'
import { useGetRealtorFiles } from '../../api/get-realtor-files'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { RealtorFilesListFilters } from './RealtorFilesListFilters'

export const RealtorFilesList = () => {
  const navigate = useNavigate()
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const mobileFilter = filters.find((f) => f.id == 'mobile')
  const statusFilter = filters.find((f) => f.id == 'file_status')
  const assignedToFilter = filters.find((f) => f.id == 'assigned_to_user')
  const callFilter = filters.find((f) => f.id == 'call')

  const realtorFilesQuery = useGetRealtorFiles({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search: globalFilter.trim() || null,
    mobile: mobileFilter?.value?.trim() || null,
    status: statusFilter?.value?.trim() || null,
    assigned_to: assignedToFilter?.value?.trim() || null,
    call_status: callFilter?.value?.trim() || null,
  })

  return (
    <DataTable
      columns={generateColumns()}
      className="bg-white"
      onRefresh={() => realtorFilesQuery.refetch()}
      data={realtorFilesQuery.data?.data || []}
      isLoading={realtorFilesQuery.isFetching}
      rowCount={realtorFilesQuery.data?.total_count}
      initialFilters={filters}
      initialPagination={pagination}
      initialGlobalFilter={globalFilter}
      onChange={updateQueryParams}
      filtersComponent={RealtorFilesListFilters}
      onRowDoubleClick={(_, row) => navigate(`/market/realtor/${row.original.id}`)}
    />
  )
}
