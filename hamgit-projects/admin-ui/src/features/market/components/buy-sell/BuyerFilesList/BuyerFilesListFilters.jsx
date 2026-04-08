import { useState } from 'react'
import { useAuthContext } from '@/features/auth'
import {
  CallStatusOptions,
  FileStatusOptions,
  MonopolyOptions,
  PhoneExportTypeEnum,
} from '@/data/enums/market_enums'
import { translateEnum } from '@/utils/enum'
import { useGetAdModerators } from '../../../api/get-ad-moderators'
import { pickWithDefaults } from '@/utils/object'
import { ExportPhonesExcel, SelectCityField, useGetDistrict, useGetRegions } from '@/features/misc'
import { useDataTable } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import SearchInput from '@/components/ui/SearchInput'
import { CloseIcon, FunnelIcon } from '@/components/icons'
import { useGetFileLabels } from '../../../api/file-labels'
import {
  Form,
  InputField,
  SelectField,
  InputNumberField,
  DatePickerField,
  useForm,
} from '@/components/ui/Form'
import { MeterSquareIcon } from '@/components/icons/MeterSquareIcon'
import { formatDate } from 'date-fns-jalali'
import { PermissionGuard } from '@/components/guards/PermissionGuard'

const defaultValues = {
  start_date: '',
  end_date: '',
  mobile: '',
  assigned_to_user: '',
  file_status: '',
  call: '',
  city_ids_str: '',
  regions_str: [],
  district_ids_str: [],
  label_ids_str: [],
  min_area: '',
  max_area: '',
  monopoly: '',
  family_members: '',
  description: '',
}

export const BuyerFilesListFilters = () => {
  const { currentUser } = useAuthContext()
  const { table } = useDataTable()
  const { columnFilters, globalFilter } = table.getState()

  const [filtersOpen, setFiltersOpen] = useState(false)

  const methods = useForm({
    values: pickWithDefaults(
      columnFilters.reduce((acc, filter) => {
        if (
          filter.id === 'regions_str' ||
          filter.id === 'district_ids_str' ||
          filter.id === 'label_ids_str'
        )
          acc[filter.id] = filter.value.split(',')
        else acc[filter.id] = filter.value

        return acc
      }, {}),
      { ...defaultValues }
    ),
  })

  const selectedCityId = methods.watch('city_ids_str')

  const { data: districts = [] } = useGetDistrict(selectedCityId, { enabled: !!selectedCityId })
  const districtOptions = districts.map((district) => ({
    label: district.name,
    value: String(district.id),
  }))

  const { data: regions = [] } = useGetRegions(selectedCityId, { enabled: !!selectedCityId })
  const regionOptions = regions.map((region) => ({
    label: `منطقه ${region}`,
    value: String(region),
  }))

  const { data: adModerators = [] } = useGetAdModerators()
  const adModeratorOptions = adModerators.map((moderator) => ({
    label: moderator.fullname,
    value: moderator.id,
  }))

  const { data: fileLabels = [] } = useGetFileLabels()
  const fileLabelOptions = fileLabels.map((label) => ({
    label: label.title,
    value: label.id,
  }))

  const applyFilters = (data) => {
    const newColumnFilters = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === '' || value === null || value === undefined) return acc

      if (key === 'regions_str' || key === 'district_ids_str' || key === 'label_ids_str') {
        if (Array.isArray(value) && value.length > 0) acc.push({ id: key, value: value.join(',') })
      } else acc.push({ id: key, value })

      return acc
    }, [])

    table.setColumnFilters(newColumnFilters)
    setFiltersOpen(false)
  }

  const clearAllFilters = () => {
    methods.reset(defaultValues)
    table.setColumnFilters([])
    setFiltersOpen(false)
  }

  const removeFilter = (filterId) => {
    const newColumnFilters = columnFilters.filter((filter) => filter.id !== filterId)
    table.setColumnFilters(newColumnFilters)
    methods.setValue(filterId, defaultValues[filterId])
  }

  const getFilterDisplayValue = (filter) => {
    const { id, value } = filter

    switch (id) {
      case 'start_date':
        return `تاریخ از: ${formatDate(value, 'yyyy/MM/dd')}`
      case 'end_date':
        return `تاریخ تا: ${formatDate(value, 'yyyy/MM/dd')}`
      case 'mobile':
        return `تلفن: ${value}`
      case 'assigned_to_user': {
        const moderator = adModerators.find((m) => m.id === value)
        return `کارشناس: ${moderator?.fullname || value}`
      }
      case 'call': {
        const callStatus = translateEnum(CallStatusOptions, value)
        return `وضعیت تماس: ${callStatus || value}`
      }
      case 'file_status': {
        const fileStatus = translateEnum(FileStatusOptions, value)
        return `وضعیت فایل: ${fileStatus || value}`
      }
      case 'min_area':
        return `متراژ از: ${value} متر`
      case 'max_area':
        return `متراژ تا: ${value} متر`
      case 'city_ids_str':
        return `شهر`
      case 'regions_str': {
        const regions = value
          .split(',')
          .map((region) => `منطقه ${region}`)
          .join(', ')
        return `مناطق: ${regions}`
      }
      case 'district_ids_str':
        return `محله`
      case 'family_members':
        return `تعداد خانواده: ${value} نفر`
      case 'monopoly': {
        const monopoly = translateEnum(MonopolyOptions, value)
        return `مونوپول: ${monopoly || value}`
      }
      case 'label_ids_str': {
        const labelIds = value.split(',')
        const labelNames = labelIds
          .map((id) => {
            const label = fileLabels.find((l) => l.id === id)
            return label?.title || id
          })
          .join(', ')
        return `برچسب‌ها: ${labelNames}`
      }
      case 'description':
        return `توضیحات: ${value}`
      default:
        return `${id}: ${value}`
    }
  }

  return (
    <>
      <div className="flex-grow">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFiltersOpen(true)}
            className="p-1.5 border-2 rounded-md border-teal-600"
          >
            <FunnelIcon className="text-teal-600" size={20} />
          </button>

          <SearchInput
            placeholder="جستجو"
            initialValue={globalFilter}
            onSubmit={(v) => table.setGlobalFilter(v)}
          />

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              methods.setValue('assigned_to_user', currentUser.id)
              table.getColumn('assigned_to_user').setFilterValue(currentUser.id)
            }}
          >
            فایل های من
          </Button>

          <PermissionGuard requiredRoles={['SUPERUSER']}>
            <span className="mr-auto">
              <ExportPhonesExcel type={PhoneExportTypeEnum.TENANT_FILE} />
            </span>
          </PermissionGuard>
        </div>

        {columnFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            {columnFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-300 rounded-full text-sm text-black"
              >
                <span className="fa">{getFilterDisplayValue(filter)}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="text-teal-600 hover:text-teal-800 transition-colors"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              حذف همه
            </button>
          </div>
        )}
      </div>

      <Dialog
        title="فیلترها"
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        className="max-w-6xl"
      >
        <Form methods={methods} onSubmit={applyFilters}>
          <div className="grid grid-cols-3 gap-x-6">
            <InputField label="شماره تلفن" name="mobile" placeholder="جستجو" />

            <div className="flex gap-2 items-end">
              <DatePickerField
                label="تاریخ ایجاد فایل"
                name="start_date"
                placeholder="از"
                className="flex-1"
              />
              <DatePickerField name="end_date" placeholder="تا" className="flex-1" />
            </div>

            <SelectField
              label="کارشناس"
              name="assigned_to_user"
              asValue
              searchable
              options={[{ label: 'همه', value: null }, ...adModeratorOptions]}
            />

            <SelectField
              label="وضعیت آخرین تماس"
              name="call"
              asValue
              options={[{ label: 'همه', value: null }, ...CallStatusOptions]}
            />

            <SelectField
              label="وضعیت فایل"
              name="file_status"
              asValue
              options={[{ label: 'همه', value: null }, ...FileStatusOptions]}
            />

            <div className="flex gap-2 items-end">
              <InputNumberField
                label="متراژ"
                name="min_area"
                placeholder="از"
                suffix={<MeterSquareIcon />}
                className="flex-1"
              />
              <InputNumberField
                name="max_area"
                placeholder="تا"
                suffix={<MeterSquareIcon />}
                className="flex-1"
              />
            </div>

            <SelectCityField label="شهر" name="city_ids_str" />

            <SelectField
              asValue
              multiSelect
              label="منطقه"
              name="regions_str"
              options={regionOptions}
            />

            <SelectField
              asValue
              multiSelect
              searchable
              label="محله"
              name="district_ids_str"
              options={districtOptions}
            />

            <InputNumberField label="تعداد خانواده" name="family_members" />

            <SelectField
              asValue
              multiSelect
              label="برچسب"
              name="label_ids_str"
              options={fileLabelOptions}
            />

            <InputField label="توضیحات" name="description" placeholder="جستجو" />
          </div>

          <div className="flex gap-2 justify-end p-4 border-t">
            <Button size="sm" variant="outline" type="button" onClick={clearAllFilters}>
              حذف همه فیلترها
            </Button>
            <Button size="sm" type="submit">
              اعمال فیلترها
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  )
}
