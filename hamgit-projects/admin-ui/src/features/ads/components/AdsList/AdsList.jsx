import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAds } from '../../api/get-ads'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import AdsListFilters from './AdsListFilters'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { Dialog } from '@/components/ui/Dialog'
import AdsListDelete from './AdsListDelete'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'

const AdsList = () => {
  const navigate = useNavigate()
  const [isArchive, setIsArchive] = useState('false')
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const statusFilter = filters.find((f) => f.id == 'status')
  const isReportedFilter = filters.find((f) => f.id == 'is_reported')

  const [selectedAdForDelete, setSelectedAdForDelete] = useState(null)

  const adsQuery = useGetAds({
    is_archived: isArchive || undefined,
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search_text: globalFilter.trim() || null,
    status: statusFilter?.value?.trim() || null,
    is_reported: isReportedFilter?.value || null,
  })

  return (
    <div className="bg-white p-2 rounded-lg border border-black/20">
      <Tabs dir="rtl" value={isArchive} onValueChange={setIsArchive}>
        <TabsList>
          <TabsTrigger value="false">جاری</TabsTrigger>
          <TabsTrigger value="true">بایگانی</TabsTrigger>
        </TabsList>
      </Tabs>
      <DataTable
        columns={generateColumns({
          onDelete: (row) => setSelectedAdForDelete(row),
        })}
        className="border-none"
        onRefresh={() => adsQuery.refetch()}
        data={adsQuery.data?.data || []}
        isLoading={adsQuery.isFetching}
        rowCount={adsQuery.data?.total_count}
        initialFilters={filters}
        initialPagination={pagination}
        initialGlobalFilter={globalFilter}
        onChange={updateQueryParams}
        filtersComponent={AdsListFilters}
        onRowDoubleClick={(_, row) => navigate(`/ads/list/${row.getValue('id')}`)}
      />
      <Dialog
        title="حذف آگهی"
        closeOnBackdrop={false}
        open={selectedAdForDelete}
        onOpenChange={(s) => setSelectedAdForDelete(s)}
      >
        <AdsListDelete
          ad={selectedAdForDelete}
          onCancel={() => setSelectedAdForDelete(null)}
          onSuccess={() => setSelectedAdForDelete(null)}
        />
      </Dialog>
    </div>
  )
}

export default AdsList
