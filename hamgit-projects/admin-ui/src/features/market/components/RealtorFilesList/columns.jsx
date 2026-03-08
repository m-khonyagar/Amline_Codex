import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { CallStatusOptions } from '@/data/enums/market_enums'
import { findOption } from '@/utils/enum'
import { MoreHorizontalIcon } from '@/components/icons'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = () => [
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
    header: 'وضعیت آخرین تماس',
    cell: ({ getValue }) => {
      const call = getValue()
      const status = call?.status
      const statusOptions = findOption(CallStatusOptions, status) || {}
      return status ? <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge> : '-'
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
              <Link to={`/market/realtor/${file.id}`}>مشاهده</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/market/realtor/${file.id}/edit`}>ویرایش</Link>
            </DropdownMenuItem>

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
