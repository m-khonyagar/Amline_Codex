import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/dom'
import { useGetLandlordFiles } from '../../../api/get-landlord-files'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { Dialog } from '@/components/ui/Dialog'
import { SellerFilesListFilters } from './SellerFilesListFilters'
import { SellerFilesListRestore } from './SellerFilesListRestore'

export const SellerFilesList = ({ className, isArchive = false }) => {
  const navigate = useNavigate()
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const [selectedRestoreFile, setSelectedRestoreFile] = useState(null)

  const startDateFilter = filters.find((f) => f.id == 'start_date')
  const endDateFilter = filters.find((f) => f.id == 'end_date')
  const mobileFilter = filters.find((f) => f.id == 'mobile')
  const statusFilter = filters.find((f) => f.id == 'file_status')
  const assignedToFilter = filters.find((f) => f.id == 'assigned_to_user')
  const callStatusFilter = filters.find((f) => f.id == 'call')
  const minAreaFilter = filters.find((f) => f.id == 'min_area')
  const maxAreaFilter = filters.find((f) => f.id == 'max_area')
  const cityFilter = filters.find((f) => f.id == 'city_ids_str')
  const regionsFilter = filters.find((f) => f.id == 'regions_str')
  const districtFilter = filters.find((f) => f.id == 'district_ids_str')
  const labelFilter = filters.find((f) => f.id == 'label_ids_str')
  const monopolyFilter = filters.find((f) => f.id == 'monopoly')
  const descriptionFilter = filters.find((f) => f.id == 'description')

  const landlordFilesQuery = useGetLandlordFiles({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    sort_by: 'updated_at',
    is_archived: isArchive || undefined,
    search: globalFilter.trim() || null,
    start_date: startDateFilter?.value?.trim() || null,
    end_date: endDateFilter?.value?.trim() || null,
    mobile: mobileFilter?.value?.trim() || null,
    assigned_to: assignedToFilter?.value?.trim() || null,
    status: statusFilter?.value?.trim() || null,
    call_status: callStatusFilter?.value?.trim() || null,
    min_area: minAreaFilter?.value?.trim() || null,
    max_area: maxAreaFilter?.value?.trim() || null,
    city_ids_str: cityFilter?.value?.trim() || null,
    regions_str: regionsFilter?.value?.trim() || null,
    district_ids_str: districtFilter?.value?.trim() || null,
    label_ids_str: labelFilter?.value?.trim() || null,
    monopoly: monopolyFilter?.value?.trim() || null,
    description: descriptionFilter?.value?.trim() || null,
    listing_type: 'SALE',
  })

  return (
    <>
      <DataTable
        columns={generateColumns(
          isArchive ? { onRestore: (row) => setSelectedRestoreFile(row) } : {}
        )}
        className={cn('bg-white', className)}
        onRefresh={() => landlordFilesQuery.refetch()}
        data={landlordFilesQuery.data?.data || []}
        isLoading={landlordFilesQuery.isFetching}
        rowCount={landlordFilesQuery.data?.total_count}
        initialFilters={filters}
        initialPagination={pagination}
        initialGlobalFilter={globalFilter}
        onChange={updateQueryParams}
        filtersComponent={SellerFilesListFilters}
        onRowDoubleClick={(_, row) => navigate(`/market/buy-sell/seller/${row.original.id}`)}
      />

      <Dialog
        title="بازیابی فایل"
        open={selectedRestoreFile}
        onOpenChange={(s) => setSelectedRestoreFile(s)}
      >
        <SellerFilesListRestore
          file={selectedRestoreFile}
          onCancel={() => setSelectedRestoreFile(null)}
          onSuccess={() => {
            landlordFilesQuery.refetch()
            setSelectedRestoreFile(null)
          }}
        />
      </Dialog>
    </>
  )
}
