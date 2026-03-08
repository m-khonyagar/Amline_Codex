import { useDataTable } from '@/components/ui/DataTable'
import Select from '@/components/ui/Select'
import { AdStatusEnumsOptions } from '@/data/enums/requirement_enums'

const AdsVisitRequestsListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters } = table.getState()

  return (
    <div className="flex flex-grow items-center gap-2 flex-wrap">
      <Select
        asValue
        placeholder="وضعیت"
        floatError={true}
        options={[{ label: 'همه', value: null }, ...AdStatusEnumsOptions]}
        defaultValue={columnFilters.find((f) => f.id == 'status')?.value}
        onChange={(v) => table.getColumn('status').setFilterValue(v)}
      />
    </div>
  )
}

export default AdsVisitRequestsListFilters
