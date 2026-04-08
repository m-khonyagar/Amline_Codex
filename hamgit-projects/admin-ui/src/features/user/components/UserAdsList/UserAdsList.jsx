import { useNavigate, useParams } from 'react-router-dom'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useGetAds } from '@/data/api/ads'
import { useGetUserInfo } from '../../api/get-user-info'
import { columns } from './columns'
import { DataTable } from '@/components/ui/DataTable'

export const UserAdsList = () => {
  const navigate = useNavigate()
  const { pagination, updateQueryParams } = useDataTableQueryParams()
  const { id: userId } = useParams()
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const adsQuery = useGetAds(
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
        onRefresh={() => adsQuery.refetch()}
        data={adsQuery.data?.data || []}
        isLoading={adsQuery.isFetching}
        rowCount={adsQuery.data?.total_count}
        initialPagination={pagination}
        onChange={updateQueryParams}
        onRowDoubleClick={(_, row) => navigate(`/ads/list/${row.getValue('id')}`)}
      />
    </div>
  )
}
