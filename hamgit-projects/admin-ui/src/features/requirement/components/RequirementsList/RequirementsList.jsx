import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetRequirements } from '../../api/get-requirements'
import { DataTable } from '@/components/ui/DataTable'
import { generateColumns } from './columns'
import RequirementsListFilters from './RequirementsListFilters'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { Dialog } from '@/components/ui/Dialog'
import RequirementsListDelete from './RequirementsListDelete'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'

const RequirementsList = () => {
  const navigate = useNavigate()
  const [isArchive, setIsArchive] = useState('false')
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const statusFilter = filters.find((f) => f.id == 'status')
  const isReportedFilter = filters.find((f) => f.id == 'is_reported')

  const [selectedRequirementForDelete, setSelectedRequirementForDelete] = useState(null)

  const requirementsQuery = useGetRequirements({
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
          onDelete: (row) => setSelectedRequirementForDelete(row),
        })}
        className="border-none"
        onRefresh={() => requirementsQuery.refetch()}
        data={requirementsQuery.data?.data || []}
        isLoading={requirementsQuery.isFetching}
        rowCount={requirementsQuery.data?.total_count}
        initialFilters={filters}
        initialPagination={pagination}
        initialGlobalFilter={globalFilter}
        onChange={updateQueryParams}
        filtersComponent={RequirementsListFilters}
        onRowDoubleClick={(_, row) =>
          navigate(`/requirements/buy-and-rental/${row.getValue('id')}`)
        }
      />

      <Dialog
        title="حذف نیازمندی"
        closeOnBackdrop={false}
        open={selectedRequirementForDelete}
        onOpenChange={(s) => setSelectedRequirementForDelete(s)}
      >
        <RequirementsListDelete
          requirement={selectedRequirementForDelete}
          onCancel={() => setSelectedRequirementForDelete(null)}
          onSuccess={() => setSelectedRequirementForDelete(null)}
        />
      </Dialog>
    </div>
  )
}

export default RequirementsList
