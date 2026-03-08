import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetExchanges } from '../../api/get-exchanges'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import BarterListFilters from './BarterListFilters'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { Dialog } from '@/components/ui/Dialog'
import BarterListDelete from './BarterListDelete'

const BarterList = () => {
  const navigate = useNavigate()
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const statusFilter = filters.find((f) => f.id == 'status')
  const isReportedFilter = filters.find((f) => f.id == 'is_reported')

  const [selectedExchangeForDelete, setSelectedExchangeForDelete] = useState(null)

  const requirementsQuery = useGetExchanges({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search_text: globalFilter.trim() || null,
    status: statusFilter?.value?.trim() || null,
    is_reported: isReportedFilter?.value || null,
  })

  return (
    <div>
      <DataTable
        columns={generateColumns({
          onDelete: (row) => setSelectedExchangeForDelete(row),
        })}
        className="bg-white"
        onRefresh={() => requirementsQuery.refetch()}
        data={requirementsQuery.data?.data || []}
        isLoading={requirementsQuery.isFetching}
        rowCount={requirementsQuery.data?.total_count}
        initialFilters={filters}
        initialPagination={pagination}
        initialGlobalFilter={globalFilter}
        onChange={updateQueryParams}
        filtersComponent={BarterListFilters}
        onRowDoubleClick={(_, row) => navigate(`/requirements/barter/${row.getValue('id')}`)}
      />

      <Dialog
        title="حذف معاوضه"
        closeOnBackdrop={false}
        open={selectedExchangeForDelete}
        onOpenChange={(s) => setSelectedExchangeForDelete(s)}
      >
        <BarterListDelete
          exchange={selectedExchangeForDelete}
          onCancel={() => setSelectedExchangeForDelete(null)}
          onSuccess={() => setSelectedExchangeForDelete(null)}
        />
      </Dialog>
    </div>
  )
}

export default BarterList
