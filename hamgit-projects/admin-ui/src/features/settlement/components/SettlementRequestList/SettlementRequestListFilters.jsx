import Select from '@/components/ui/Select'
import SearchInput from '@/components/ui/SearchInput'
import { useDataTable } from '@/components/ui/DataTable'
import { SettlementStatusOptions } from '@/data/enums/settlement_status_enums'

const SettlementRequestListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters, globalFilter } = table.getState()

  return (
    <div className="flex gap-2">
      <SearchInput
        placeholder="جستجو"
        onSubmit={(v) => table.setGlobalFilter(v)}
        initialValue={globalFilter}
      />

      <Select
        asValue
        className="basis-64"
        placeholder="وضعیت"
        floatError={true}
        options={[{ label: 'همه', value: null }, ...SettlementStatusOptions]}
        defaultValue={columnFilters.find((f) => f.id === 'status')?.value}
        onChange={(v) => table.getColumn('status').setFilterValue(v)}
      />
    </div>
  )
}

export default SettlementRequestListFilters
