import Checkbox from '@/components/ui/Checkbox'
import { useDataTable } from '@/components/ui/DataTable'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import { AdStatusEnumsOptions } from '@/data/enums/requirement_enums'

const RequirementsListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters, globalFilter } = table.getState()

  return (
    <div className="flex flex-grow items-center gap-2 flex-wrap">
      <SearchInput
        placeholder="موبایل"
        onSubmit={(v) => table.setGlobalFilter(v)}
        initialValue={globalFilter}
      />
      <Select
        asValue
        placeholder="وضعیت"
        floatError={true}
        options={[{ label: 'همه', value: null }, ...AdStatusEnumsOptions]}
        defaultValue={columnFilters.find((f) => f.id == 'status')?.value}
        onChange={(v) => table.getColumn('status').setFilterValue(v)}
      />
      <Checkbox
        key="is_reported"
        label="گزارش شده ها"
        defaultChecked={columnFilters.find((f) => f.id == 'is_reported')?.value}
        onChange={(value) => {
          const newFilters = value
            ? [...columnFilters, { id: 'is_reported', value }]
            : columnFilters.filter((f) => f.id !== 'is_reported')
          table.setColumnFilters(newFilters)
        }}
      />
    </div>
  )
}

export default RequirementsListFilters
