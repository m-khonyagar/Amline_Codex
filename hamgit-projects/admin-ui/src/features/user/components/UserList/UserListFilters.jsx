import { useDataTable } from '@/components/ui/DataTable'
import SearchInput from '@/components/ui/SearchInput'
import { ExportPhonesExcel } from '@/features/misc'
import { PhoneExportTypeEnum } from '@/data/enums/market_enums'
import { userCallStatusEnum, userRolesOptions } from '@/data/enums/user-enums'
import Select from '@/components/ui/Select'
import { PermissionGuard } from '@/components/guards/PermissionGuard'

const UserListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters, globalFilter } = table.getState()

  return (
    <div className="flex justify-between items-center flex-grow gap-2">
      <div className="flex items-center gap-2">
        <SearchInput onSubmit={(v) => table.setGlobalFilter(v)} initialValue={globalFilter} />

        <Select
          asValue
          floatError
          placeholder="وضعیت تماس"
          options={[{ label: 'همه', value: null }, ...userCallStatusEnum]}
          value={columnFilters.find((f) => f.id == 'status')?.value}
          onChange={(v) => table.getColumn('status').setFilterValue(v)}
        />

        <Select
          asValue
          floatError
          placeholder="نقش ها"
          options={[{ label: 'همه', value: null }, ...userRolesOptions]}
          value={columnFilters.find((f) => f.id == 'roles')?.value}
          onChange={(v) => table.getColumn('roles').setFilterValue(v)}
        />
      </div>

      <PermissionGuard requiredRoles={['SUPERUSER']}>
        <ExportPhonesExcel type={PhoneExportTypeEnum.USER} />
      </PermissionGuard>
    </div>
  )
}

export default UserListFilters
