import { Badge } from '@/components/ui/Badge'
import { CallStatusOptions, FileStatusOptions, MonopolyOptions } from '@/data/enums/market_enums'
import { findOption, translateEnum } from '@/utils/enum'
import { numberSeparator } from '@/utils/number'

/**
 * Generate columns for landlord files
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
export const generateLandlordColumns = () => [
  {
    accessorKey: 'assigned_to_user',
    header: 'کارشناس مربوطه',
    className: 'fa',
    cell: ({ getValue }) => {
      const userName = getValue()?.fullname
      return userName || '-'
    },
  },
  {
    accessorKey: 'file_status',
    header: 'وضعیت فایل',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusOptions = findOption(FileStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'mobile',
    header: 'شماره تلفن',
    className: 'fa',
  },
  {
    accessorKey: 'full_name',
    header: 'نام و نام خانوادگی',
    className: 'fa',
  },
  {
    accessorKey: 'deposit',
    header: 'مبلغ رهن',
    className: 'fa',
    cell: ({ getValue }) => {
      const deposit = getValue()
      return deposit ? numberSeparator(deposit) : '-'
    },
  },
  {
    accessorKey: 'rent',
    header: 'مبلغ اجاره',
    className: 'fa',
    cell: ({ getValue }) => {
      const rent = getValue()
      return rent ? numberSeparator(rent) : '-'
    },
  },
  {
    accessorKey: 'area',
    header: 'متراژ',
    className: 'fa',
    cell: ({ getValue }) => {
      const area = getValue()
      return area ? `${area} متر` : '-'
    },
  },
  {
    accessorKey: 'city',
    header: 'شهر',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const province = value?.province
      const name = value?.name
      return province && name ? `${province} - ${name}` : '-'
    },
  },
  {
    accessorKey: 'district',
    header: 'محله',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const name = value?.name
      return name || '-'
    },
  },
  {
    accessorKey: 'region',
    header: 'منطقه',
    className: 'fa',
  },
  {
    accessorKey: 'monopoly',
    header: 'مونوپول',
    cell: ({ getValue }) => {
      const monopoly = getValue()
      return monopoly ? translateEnum(MonopolyOptions, monopoly) : '-'
    },
  },
  {
    accessorKey: 'call',
    header: 'وضعیت آخرین تماس',
    cell: ({ getValue }) => {
      const call = getValue()
      const status = call?.status
      const statusOptions = findOption(CallStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'labels',
    header: 'برچسب ها',
    cell: ({ getValue }) => {
      const labels = getValue()
      return (
        labels?.map((label) => (
          <Badge key={label.id} variant="outline" className="m-0.5">
            {label.title}
          </Badge>
        )) || '-'
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'تاریخ ویرایش',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
]

/**
 * Generate columns for tenant files
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
export const generateTenantColumns = () => [
  {
    accessorKey: 'assigned_to_user',
    header: 'کارشناس مربوطه',
    className: 'fa',
    cell: ({ getValue }) => {
      const userName = getValue()?.fullname
      return userName || '-'
    },
  },
  {
    accessorKey: 'file_status',
    header: 'وضعیت فایل',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusOptions = findOption(FileStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'mobile',
    header: 'شماره تلفن مستاجر',
    className: 'fa',
  },
  {
    accessorKey: 'full_name',
    header: 'نام و نام خانوادگی',
    className: 'fa',
  },
  {
    accessorKey: 'family_members_count',
    header: 'تعداد خانواده',
    className: 'fa',
    cell: ({ getValue }) => getValue() || '-',
  },
  {
    accessorKey: 'deposit',
    header: 'حداکثر رهن',
    className: 'fa',
    cell: ({ getValue }) => {
      const deposit = getValue()
      return deposit ? numberSeparator(deposit) : '-'
    },
  },
  {
    accessorKey: 'rent',
    header: 'حداکثر اجاره',
    className: 'fa',
    cell: ({ getValue }) => {
      const rent = getValue()
      return rent ? numberSeparator(rent) : '-'
    },
  },
  {
    accessorKey: 'area',
    header: 'حداقل متراژ',
    className: 'fa',
    cell: ({ getValue }) => {
      const area = getValue()
      return area ? `${area} متر` : '-'
    },
  },
  {
    accessorKey: 'city',
    header: 'شهر',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const province = value?.province
      const name = value?.name
      return province && name ? `${province} - ${name}` : '-'
    },
  },
  {
    accessorKey: 'districts',
    header: 'محله',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const districts = value?.map((district) => district.name).join(' - ')
      return districts || '-'
    },
  },
  {
    accessorKey: 'call',
    header: 'وضعیت آخرین تماس',
    cell: ({ getValue }) => {
      const call = getValue()
      const status = call?.status
      const statusOptions = findOption(CallStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'labels',
    header: 'برچسب ها',
    cell: ({ getValue }) => {
      const labels = getValue()
      return (
        labels?.map((label) => (
          <Badge key={label.id} variant="outline" className="m-0.5">
            {label.title}
          </Badge>
        )) || '-'
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'تاریخ ویرایش',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
]

/**
 * Generate columns for buyer files
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
export const generateBuyerColumns = () => [
  {
    accessorKey: 'assigned_to_user',
    header: 'کارشناس مربوطه',
    className: 'fa',
    cell: ({ getValue }) => {
      const userName = getValue()?.fullname
      return userName || '-'
    },
  },
  {
    accessorKey: 'file_status',
    header: 'وضعیت فایل',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusOptions = findOption(FileStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'mobile',
    header: 'شماره تلفن خریدار',
    className: 'fa',
  },
  {
    accessorKey: 'full_name',
    header: 'نام و نام خانوادگی',
    className: 'fa',
  },
  {
    accessorKey: 'budget',
    header: 'بودجه خرید',
    className: 'fa',
    cell: ({ getValue }) => {
      const budget = getValue()
      return budget ? numberSeparator(budget) : '-'
    },
  },
  {
    accessorKey: 'area',
    header: 'حداقل متراژ',
    className: 'fa',
    cell: ({ getValue }) => {
      const area = getValue()
      return area ? `${area} متر` : '-'
    },
  },
  {
    accessorKey: 'city',
    header: 'شهر',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const province = value?.province
      const name = value?.name
      return province && name ? `${province} - ${name}` : '-'
    },
  },
  {
    accessorKey: 'districts',
    header: 'محله',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const districts = value?.map((district) => district.name).join(' - ')
      return districts || '-'
    },
  },
  {
    accessorKey: 'call',
    header: 'وضعیت آخرین تماس',
    cell: ({ getValue }) => {
      const call = getValue()
      const status = call?.status
      const statusOptions = findOption(CallStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'labels',
    header: 'برچسب ها',
    cell: ({ getValue }) => {
      const labels = getValue()
      return (
        labels?.map((label) => (
          <Badge key={label.id} variant="outline" className="m-0.5">
            {label.title}
          </Badge>
        )) || '-'
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'تاریخ ویرایش',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
]

/**
 * Generate columns for seller files
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
export const generateSellerColumns = () => [
  {
    accessorKey: 'assigned_to_user',
    header: 'کارشناس مربوطه',
    className: 'fa',
    cell: ({ getValue }) => {
      const userName = getValue()?.fullname
      return userName || '-'
    },
  },
  {
    accessorKey: 'file_status',
    header: 'وضعیت فایل',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusOptions = findOption(FileStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'mobile',
    header: 'شماره تلفن',
    className: 'fa',
  },
  {
    accessorKey: 'full_name',
    header: 'نام و نام خانوادگی',
    className: 'fa',
  },
  {
    accessorKey: 'sale_price',
    header: 'قیمت ملک',
    className: 'fa',
    cell: ({ getValue }) => {
      const salePrice = getValue()
      return salePrice ? numberSeparator(salePrice) : '-'
    },
  },
  {
    accessorKey: 'area',
    header: 'متراژ',
    className: 'fa',
    cell: ({ getValue }) => {
      const area = getValue()
      return area ? `${area} متر` : '-'
    },
  },
  {
    accessorKey: 'city',
    header: 'شهر',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const province = value?.province
      const name = value?.name
      return province && name ? `${province} - ${name}` : '-'
    },
  },
  {
    accessorKey: 'district',
    header: 'محله',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const name = value?.name
      return name || '-'
    },
  },
  {
    accessorKey: 'region',
    header: 'منطقه',
    className: 'fa',
  },
  {
    accessorKey: 'monopoly',
    header: 'مونوپول',
    cell: ({ getValue }) => {
      const monopoly = getValue()
      return monopoly ? translateEnum(MonopolyOptions, monopoly) : '-'
    },
  },
  {
    accessorKey: 'call',
    header: 'وضعیت آخرین تماس',
    cell: ({ getValue }) => {
      const call = getValue()
      const status = call?.status
      const statusOptions = findOption(CallStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'labels',
    header: 'برچسب ها',
    cell: ({ getValue }) => {
      const labels = getValue()
      return (
        labels?.map((label) => (
          <Badge key={label.id} variant="outline" className="m-0.5">
            {label.title}
          </Badge>
        )) || '-'
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'تاریخ ویرایش',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
]

/**
 * Generate columns for realtor files
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
export const generateRealtorColumns = () => [
  {
    accessorKey: 'assigned_to_user',
    header: 'کارشناس مربوطه',
    className: 'fa',
    cell: ({ getValue }) => {
      const userName = getValue()?.fullname
      return userName || '-'
    },
  },
  {
    accessorKey: 'mobile',
    header: 'شماره تلفن',
    className: 'fa',
  },
  {
    accessorKey: 'full_name',
    header: 'نام و نام خانوادگی',
    className: 'fa',
  },
  {
    accessorKey: 'office_name',
    header: 'نام املاک',
    className: 'fa',
    cell: ({ getValue }) => {
      const officeName = getValue()
      return officeName || '-'
    },
  },
  {
    accessorKey: 'city',
    header: 'شهر',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const province = value?.province
      const name = value?.name
      return province && name ? `${province} - ${name}` : '-'
    },
  },
  {
    accessorKey: 'districts',
    header: 'محله',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const districts = value?.map((district) => district.name).join(' - ')
      return districts || '-'
    },
  },
  {
    accessorKey: 'regions',
    header: 'مناطق تحت پوشش',
    className: 'fa',
    cell: ({ getValue }) => {
      const value = getValue()
      const regions = value?.join(' - ')
      return regions || '-'
    },
  },
  {
    accessorKey: 'call',
    header: 'وضعیت آخرین مسئول',
    cell: ({ getValue }) => {
      const call = getValue()
      const status = call?.status
      const statusOptions = findOption(CallStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
    },
  },
  {
    accessorKey: 'labels',
    header: 'برچسب ها',
    cell: ({ getValue }) => {
      const labels = getValue()
      return (
        labels?.map((label) => (
          <Badge key={label.id} variant="outline" className="m-0.5">
            {label.title}
          </Badge>
        )) || '-'
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'تاریخ ویرایش',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return '-'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
]
