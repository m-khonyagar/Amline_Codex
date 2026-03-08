import { useState } from 'react'
import AdRequestForm from './AdRequestForm'
import { useGetAdsVisitRequests } from '../../api/get-ads-visit-requests'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import AdsVisitRequestsListFilters from './AdsVisitRequestsListFilters'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { Dialog } from '@/components/ui/Dialog'

const AdsVisitRequestsList = () => {
  const { pagination, filters, updateQueryParams } = useDataTableQueryParams()

  const statusFilter = filters.find((f) => f.id == 'status')

  const [selectedAdForChange, setSelectedAdForChange] = useState(null)

  const adsVisitRequests = useGetAdsVisitRequests({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    status: statusFilter?.value?.trim() || null,
  })

  return (
    <div>
      <DataTable
        columns={generateColumns({
          onChange: (row) => setSelectedAdForChange(row),
        })}
        className="bg-white"
        onRefresh={() => adsVisitRequests.refetch()}
        data={adsVisitRequests.data?.data || []}
        isLoading={adsVisitRequests.isFetching}
        rowCount={adsVisitRequests.data?.total_count}
        initialFilters={filters}
        initialPagination={pagination}
        onChange={updateQueryParams}
        filtersComponent={AdsVisitRequestsListFilters}
      />

      <Dialog
        closeOnBackdrop={false}
        title="تغییر وضعیت درخواست"
        open={selectedAdForChange}
        onOpenChange={(s) => setSelectedAdForChange(s)}
      >
        <AdRequestForm
          item={selectedAdForChange}
          onCancel={() => setSelectedAdForChange(null)}
          onSuccess={() => setSelectedAdForChange(null)}
        />
      </Dialog>
    </div>
  )
}

export default AdsVisitRequestsList
