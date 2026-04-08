import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { DataTable } from '@/components/ui/DataTable'
import { useGetPRContracts } from '@/features/contract'
import { useGetUserInfo } from '../../api/get-user-info'
import { columns } from './columns'

export const UserContractsList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const prContractsQuery = useGetPRContracts(
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
        columns={columns}
        className="border-none fa"
        data={prContractsQuery.data?.data || []}
        isLoading={prContractsQuery.isFetching}
        rowCount={prContractsQuery.data?.total_count}
        initialPagination={pagination}
        onChange={updateQueryParams}
        onRefresh={() => prContractsQuery.refetch()}
        onRowDoubleClick={(_, row) => navigate(`/contracts/prs/${row.getValue('id')}`)}
      />
    </div>
  )
}
