import { TaskStatusOptions } from '@/data/enums/market_enums'
import { useGetAdModerators } from '../../../api/get-ad-moderators'
import Select from '@/components/ui/Select'
import SearchInput from '@/components/ui/SearchInput'
import { useDataTable } from '@/components/ui/DataTable'

export const TaskListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters } = table.getState()

  const { data: adModerators = [] } = useGetAdModerators()
  const adModeratorOptions = adModerators.map((moderator) => ({
    value: moderator.id,
    label: moderator.fullname,
  }))

  return (
    <div className="flex flex-grow items-center gap-2 flex-wrap">
      <SearchInput
        placeholder="عنوان وظیفه"
        initialValue={columnFilters.find((f) => f.id == 'title')?.value}
        onSubmit={(v) => table.getColumn('title').setFilterValue(v)}
      />
      <Select
        asValue
        placeholder="وضعیت"
        floatError={true}
        options={[{ label: 'همه', value: null }, ...TaskStatusOptions]}
        onChange={(v) => table.getColumn('status').setFilterValue(v)}
        value={columnFilters.find((f) => f.id == 'status')?.value ?? null}
      />
      <Select
        asValue
        placeholder="کارشناس فایل"
        floatError={true}
        options={[{ label: 'همه', value: null }, ...adModeratorOptions]}
        onChange={(v) => table.getColumn('assigned_to_user').setFilterValue(v)}
        value={columnFilters.find((f) => f.id == 'assigned_to_user')?.value ?? null}
      />
    </div>
  )
}
