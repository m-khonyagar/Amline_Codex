import { useState } from 'react'
import { columns } from './columns'
import { DataTable } from '@/components/ui/DataTable'
import { useGetUserCustomInvoices } from '../../api/get-user-custom-invoices'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const CustomInvoiceList = () => {
  const [mobile, setMobile] = useState('')

  const customInvoicesQuery = useGetUserCustomInvoices(
    {
      mobile: mobile.trim() || null,
    },
    { enabled: false }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    customInvoicesQuery.refetch()
  }

  return (
    <div className="bg-white rounded-lg px-4 py-4">
      <div className="border-b mb-4">
        <h2 className="font-semibold">استعلام لینک های کاربر</h2>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="flex gap-4 items-end mb-4">
        <Input
          ltr
          isNumeric
          floatError
          placeholder="موبایل"
          name="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <Button type="submit" variant="gray">
          استعلام
        </Button>
      </form>

      <DataTable
        columns={columns}
        className="bg-white fa"
        data={customInvoicesQuery.data || []}
        showPagination={false}
        showViewOptions={false}
        isLoading={customInvoicesQuery.isFetching}
        // rowCount={prContractsQuery.data?.total_count}
        // onPaginationChange={setPagination}
        // filtersComponent={PRContractListFilters}
        // onGlobalFilterChange={setGlobalFilter}
        // onFiltersChange={setFilters}
        // onRefresh={() => prContractsQuery.refetch()}
        // onRowDoubleClick={(_, row) => navigate(`/contracts/prs/${row.getValue('id')}`)}
      />
    </div>
  )
}

export default CustomInvoiceList
