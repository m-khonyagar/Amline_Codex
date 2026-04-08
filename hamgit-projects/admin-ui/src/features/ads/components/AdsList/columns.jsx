import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { AdPropertyTypeTranslation } from '@/data/enums/ads_enums.js'
import { AdStatusEnumsOptions } from '@/data/enums/requirement_enums.js'
import { MoreHorizontalIcon } from '@/components/icons'
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/solid'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = ({ onDelete }) => [
  {
    accessorKey: 'id',
    header: 'شناسه',
    className: 'fa',
  },
  {
    accessorKey: 'title',
    header: 'عنوان',
    className: 'fa',
  },
  {
    accessorKey: 'user',
    header: 'موبایل',
    className: 'fa',
    cell: ({ getValue }) => getValue().mobile || '',
  },
  {
    accessorKey: 'type',
    header: 'نوع',
    className: 'fa',
    cell: ({ getValue }) => {
      const type = getValue()
      return type ? AdPropertyTypeTranslation[type] : ''
    },
  },
  {
    accessorKey: 'created_by_admin',
    header: 'ایجاد شده توسط ادمین',
    className: 'fa',
    cell: ({ getValue }) =>
      getValue() ? (
        <CheckBadgeIcon className="size-6 text-sky-400" />
      ) : (
        <XCircleIcon className="size-6 text-red-400" />
      ),
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      const statusOptions = AdStatusEnumsOptions.find((i) => i.value === status) || {}
      return <Badge variant={statusOptions.variant}>{statusOptions.label}</Badge>
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const ad = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
              <MoreHorizontalIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy user ID
            </DropdownMenuItem> */}

            {/* <DropdownMenuSeparator /> */}

            <DropdownMenuItem asChild>
              <Link to={`/ads/list/${ad.id}`}>مشاهده</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/ads/list/${ad.id}/edit`}>ویرایش</Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(ad)}
              className="text-red-600 hover:text-red-800 focus:text-red-800 focus:bg-red-50"
            >
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { generateColumns }
