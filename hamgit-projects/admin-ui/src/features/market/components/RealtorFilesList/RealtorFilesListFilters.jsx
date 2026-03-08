import Select from '@/components/ui/Select'
import SearchInput from '@/components/ui/SearchInput'
import { useDataTable } from '@/components/ui/DataTable'
import { CallStatusOptions, PhoneExportTypeEnum } from '@/data/enums/market_enums'
import { ExportPhonesExcel } from '@/features/misc'
import { PermissionGuard } from '@/components/guards/PermissionGuard'

export const RealtorFilesListFilters = () => {
  const { table } = useDataTable()
  const { columnFilters, globalFilter } = table.getState()

  return (
    <div className="flex flex-grow items-center gap-2 flex-wrap">
      <SearchInput
        placeholder="شماره تلفن"
        initialValue={columnFilters.find((f) => f.id == 'mobile')?.value}
        onSubmit={(v) => table.getColumn('mobile').setFilterValue(v)}
      />
      <SearchInput
        placeholder="نام و نام خانوادگی"
        onSubmit={(v) => table.setGlobalFilter(v)}
        initialValue={globalFilter}
      />
      <Select
        asValue
        placeholder="وضعیت تماس"
        floatError={true}
        options={[{ label: 'همه', value: null }, ...CallStatusOptions]}
        onChange={(v) => table.getColumn('call').setFilterValue(v)}
        value={columnFilters.find((f) => f.id == 'call')?.value ?? null}
      />

      <PermissionGuard requiredRoles={['SUPERUSER']}>
        <span className="mr-auto">
          <ExportPhonesExcel type={PhoneExportTypeEnum.REALTOR_FILE} />
        </span>
      </PermissionGuard>
    </div>
  )
}
