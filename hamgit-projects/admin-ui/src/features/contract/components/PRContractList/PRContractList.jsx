import { useState } from 'react'
import { generateColumns } from './columns'
import { useNavigate } from 'react-router-dom'
import { Dialog } from '@/components/ui/Dialog'
import PRContractDelete from './PRContractDelete'
import { DataTable } from '@/components/ui/DataTable'
import { useGetPRContracts } from '../../api/get-pr-contracts'
import PRContractListFilters from './PRContractListFilters'
import { useDataTableQueryParams } from '@/hooks/use-query-params'
import { useHasPermission } from '@/hooks/use-permission'
import { contractColor } from '@/data/enums/prcontract-enums'
import PRContractColorEdit from '../PRContractColor/PRContractColorEdit'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import LoadingAndRetry from '@/components/LoadingAndRetry'

const PRContractList = () => {
  const navigate = useNavigate()
  const hasPermission = useHasPermission(['AUDITOR'], { exclude: true })
  const { pagination, globalFilter, filters, updateQueryParams } = useDataTableQueryParams()

  const [selectedContractForDelete, setSelectedContractForDelete] = useState(null)
  const [selectedContractForColorChange, setSelectedContractForColorChange] = useState(null)

  const idFilter = filters.find((f) => f.id == 'id')
  const mobileFilter = filters.find((f) => f.id == 'landlord_mobile')
  const statusFilter = filters.find((f) => f.id == 'status')
  const contractAdminFilter = filters.find((f) => f.id == 'contract_admin')

  const prContractsQuery = useGetPRContracts({
    offset: pagination.pageIndex * pagination.pageSize,
    limit: pagination.pageSize,
    search: globalFilter.trim() || null,
    mobile: mobileFilter?.value?.trim() || null,
    contract_id: idFilter?.value?.trim() || null,
    status: statusFilter?.value?.trim() || null,
    contract_admin: contractAdminFilter?.value || null,
  })

  const rowClassName = (row) => {
    const color = row.color || row.contract?.color
    if (color === contractColor.RED) return 'bg-red-50'
    if (color === contractColor.GREEN) return 'bg-green-50'
    if (color === contractColor.PURPLE) return 'bg-purple-50'
    return ''
  }

  return (
    <div>
      <DataTable
        columns={generateColumns({
          onDelete: (row) => setSelectedContractForDelete(row),
          onChangeColor: (row) => setSelectedContractForColorChange(row),
          showActions: hasPermission,
        })}
        className="bg-white fa"
        data={prContractsQuery.data?.data || []}
        isLoading={prContractsQuery.isFetching}
        rowCount={prContractsQuery.data?.total_count}
        filtersComponent={PRContractListFilters}
        initialFilters={filters}
        initialPagination={pagination}
        initialGlobalFilter={globalFilter}
        onChange={updateQueryParams}
        onRefresh={() => prContractsQuery.refetch()}
        onRowDoubleClick={(_, row) =>
          hasPermission && navigate(`/contracts/prs/${row.getValue('id')}`)
        }
        rowClassName={rowClassName}
      />

      <Dialog
        title="حذف قرارداد"
        closeOnBackdrop={false}
        open={selectedContractForDelete}
        onOpenChange={(s) => setSelectedContractForDelete(s)}
      >
        <PRContractDelete
          prContract={selectedContractForDelete}
          onCancel={() => setSelectedContractForDelete(null)}
          onSuccess={() => setSelectedContractForDelete(null)}
        />
      </Dialog>

      {selectedContractForColorChange && (
        <ColorChangeDialog
          contractId={selectedContractForColorChange.id}
          onClose={() => setSelectedContractForColorChange(null)}
        />
      )}
    </div>
  )
}

const ColorChangeDialog = ({ contractId, onClose }) => {
  const prContractQuery = useGetPRContractInfo(contractId)

  return (
    <Dialog
      title="ویرایش رنگ قرارداد"
      closeOnBackdrop={false}
      open={!!contractId}
      onOpenChange={(open) => !open && onClose()}
    >
      <LoadingAndRetry query={prContractQuery}>
        {prContractQuery.data && (
          <PRContractColorEdit
            prContract={prContractQuery.data}
            onCancel={onClose}
            onSuccess={onClose}
          />
        )}
      </LoadingAndRetry>
    </Dialog>
  )
}

export default PRContractList
