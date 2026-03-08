import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetRequirements } from '@/data/api/requirement'
import { columns } from './columns'
import { useGetUserInfo } from '../../api/get-user-info'
import { DataTable } from '@/components/ui/DataTable'

export const UserRequirementsList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const requirementsQuery = useGetRequirements(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      search_text: user?.mobile || null,
    },
    { enabled: !!user?.mobile }
  )

  return (
    <div className="bg-white rounded-2xl p-2">
      <DataTable
        columns={columns}
        className="border-none"
        onRefresh={() => requirementsQuery.refetch()}
        data={requirementsQuery.data?.data || []}
        isLoading={requirementsQuery.isFetching}
        rowCount={requirementsQuery.data?.total_count}
        initialPagination={pagination}
        onChange={updateQueryParams}
        onRowDoubleClick={(_, row) =>
          navigate(`/requirements/buy-and-rental/${row.getValue('id')}`)
        }
      />
    </div>
  )
}
