import { useNavigate } from 'react-router-dom'
import { useGetUsers } from '../../api/get-users'
import { DataTable } from '@/components/ui/DataTable'
import { columns } from './columns'
import UserListFilters from './UserListFilters'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { findOption } from '@/utils/enum'
import { userCallStatusEnum } from '@/data/enums/user-enums'

const UsersList = () => {
  const navigate = useNavigate()
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const lastCallStatusFilter = filters.find((f) => f.id == 'status')
  const roleFilter = filters.find((f) => f.id == 'roles')

  const usersQuery = useGetUsers({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search_text: globalFilter.trim() || null,
    last_call_status: lastCallStatusFilter?.value || null,
    role: roleFilter?.value || null,
  })

  const rowClassName = (row) => {
    if (!row.last_call_status) return ''
    return findOption(userCallStatusEnum, row.last_call_status)?.bg
  }

  return (
    <DataTable
      columns={columns}
      className="bg-white"
      onRefresh={() => usersQuery.refetch()}
      data={usersQuery.data?.data || []}
      isLoading={usersQuery.isFetching}
      rowCount={usersQuery.data?.total_count}
      initialFilters={filters}
      initialPagination={pagination}
      initialGlobalFilter={globalFilter}
      initialColumnVisibility={{ status: false }}
      onChange={updateQueryParams}
      filtersComponent={UserListFilters}
      onRowDoubleClick={(_, row) => navigate(`/users/${row.original.id}`)}
      rowClassName={rowClassName}
    />
  )
}

export default UsersList
