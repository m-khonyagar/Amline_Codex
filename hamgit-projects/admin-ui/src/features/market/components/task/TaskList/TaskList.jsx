import { useNavigate } from 'react-router-dom'
import { useGetTasks } from '../../../api/task-queries'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { TaskListFilters } from './TaskListFilters'
import { TaskStatusEnum } from '@/data/enums/market_enums'

export const TaskList = () => {
  const navigate = useNavigate()
  const { pagination, filters, updateQueryParams } = useDataTableQueryParams()

  const titleFilter = filters.find((f) => f.id == 'title')
  const assignedToFilter = filters.find((f) => f.id == 'assigned_to_user')
  const statusFilter = filters.find((f) => f.id == 'status')

  const tasksQuery = useGetTasks({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search: titleFilter?.value?.trim() || null,
    assigned_to: assignedToFilter?.value?.trim() || null,
    status: statusFilter?.value?.trim() || null,
  })

  const rowClassName = (row) => {
    if (!row.due_date || row.status === TaskStatusEnum.DONE) return ''
    return new Date(row.due_date).getTime() - Date.now() < 86_400_000 ? 'bg-red-50' : ''
  }

  return (
    <DataTable
      columns={generateColumns}
      className="bg-white"
      onRefresh={() => tasksQuery.refetch()}
      data={tasksQuery.data?.data || []}
      isLoading={tasksQuery.isFetching}
      rowCount={tasksQuery.data?.total_count}
      initialFilters={filters}
      initialPagination={pagination}
      onChange={updateQueryParams}
      filtersComponent={TaskListFilters}
      onRowDoubleClick={(_, row) => navigate(`/market/task/${row.original.id}`)}
      rowClassName={rowClassName}
    />
  )
}
