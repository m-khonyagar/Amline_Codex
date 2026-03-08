import { useDataTable } from '@/components/ui/DataTable'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import { contractStatusOptions } from '@/data/enums/prcontract-enums'

const PRContractListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters, globalFilter } = table.getState()

  return (
    <div className="flex flex-grow gap-2 flex-wrap">
      <SearchInput
        placeholder="نام و نام خانوادگی"
        onSubmit={(v) => table.setGlobalFilter(v)}
        initialValue={globalFilter}
      />

      <SearchInput
        placeholder="موبایل"
        initialValue={columnFilters.find((f) => f.id == 'landlord_mobile')?.value}
        onSubmit={(v) => table.getColumn('landlord_mobile').setFilterValue(v)}
      />

      <SearchInput
        placeholder="شناسه قرارداد"
        initialValue={columnFilters.find((f) => f.id == 'id')?.value}
        onSubmit={(v) => table.getColumn('id').setFilterValue(v)}
      />

      <Select
        asValue
        // className="basis-64"
        placeholder="وضعیت"
        floatError
        defaultValue={columnFilters.find((f) => f.id == 'status')?.value}
        options={[{ label: 'همه', value: null }, ...contractStatusOptions]}
        onChange={(v) => table.getColumn('status').setFilterValue(v)}
      />

      <Select
        asValue
        floatError
        placeholder="قرارداد ادمین"
        defaultValue={columnFilters.find((f) => f.id == 'contract_admin')?.value ?? null}
        options={[
          { label: 'خیر', value: null },
          { label: 'بله', value: 'true' },
        ]}
        onChange={(v) => {
          const otherFilters = columnFilters.filter((f) => f.id !== 'contract_admin')
          if (v !== null && v !== undefined)
            table.setColumnFilters([...otherFilters, { id: 'contract_admin', value: v }])
          else table.setColumnFilters(otherFilters)
        }}
      />
    </div>
  )
}

export default PRContractListFilters
