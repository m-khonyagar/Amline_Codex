import { useState } from 'react'
import { generateColumns } from './columns'
import { Dialog } from '@/components/ui/Dialog'
import { DataTable } from '@/components/ui/DataTable'
import SettlementRequestListFilters from './SettlementRequestListFilters'
import { useGetSettlementRequests } from '../../api/get-settlement-requests'
import SettlementRequestView from '../SettlementRequestView/SettlementRequestView'
import { useDataTableQueryParams } from '@/hooks/use-query-params'

const SettlementRequestList = () => {
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const [selectedSettlementRequestForView, setSelectedSettlementRequestForView] = useState(null)

  const statusFilter = filters.find((f) => f.id == 'status')

  const settlementRequestsQuery = useGetSettlementRequests({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    text: globalFilter.trim() || null,
    status: statusFilter?.value?.trim() || null,
  })

  return (
    <div>
      <DataTable
        columns={generateColumns({
          onView: (row) => setSelectedSettlementRequestForView(row),
        })}
        data={settlementRequestsQuery.data?.data || []}
        className="bg-white fa"
        initialFilters={filters}
        initialPagination={pagination}
        initialGlobalFilter={globalFilter}
        onChange={updateQueryParams}
        noResultMessage="درخواست برداشتی ثبت نشده است."
        isLoading={settlementRequestsQuery.isFetching}
        filtersComponent={SettlementRequestListFilters}
        onRefresh={() => settlementRequestsQuery.refetch()}
        onRowDoubleClick={(_, row) => setSelectedSettlementRequestForView(row.original)}
      />

      <Dialog
        title="جزییات درخواست برداشت"
        closeOnBackdrop={false}
        open={selectedSettlementRequestForView}
        onOpenChange={(s) => setSelectedSettlementRequestForView(s)}
      >
        <SettlementRequestView
          settlementRequest={selectedSettlementRequestForView}
          onCancel={() => setSelectedSettlementRequestForView(null)}
          onSuccess={() => setSelectedSettlementRequestForView(null)}
        />
      </Dialog>
    </div>
  )
}

export default SettlementRequestList
