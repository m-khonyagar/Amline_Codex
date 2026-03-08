import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { CallStatusOptions, FileStatusOptions, MonopolyOptions } from '@/data/enums/market_enums'
import { findOption, translateEnum } from '@/utils/enum'
import { MoreHorizontalIcon } from '@/components/icons'
import { numberSeparator } from '@/utils/number'

/**
 * @param {Object} props
 * @param {Function} props.onRestore
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = ({ onRestore }) => [
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
  {
    accessorKey: 'actions',
    header: '',
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const file = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
              <MoreHorizontalIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            <DropdownMenuItem asChild>
              <Link to={`/market/buy-sell/seller/${file.id}`}>مشاهده</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/market/buy-sell/seller/${file.id}/edit`}>ویرایش</Link>
            </DropdownMenuItem>
            {onRestore && (
              <DropdownMenuItem onClick={() => onRestore(file)}>بازیابی</DropdownMenuItem>
            )}

            {/* <DropdownMenuItem
              onClick={() => onDelete(file)}
              className="text-red-600 hover:text-red-800 focus:text-red-800 focus:bg-red-50"
            >
              حذف
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { generateColumns }
