import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { AdStatusEnumsOptions } from '@/data/enums/requirement_enums.js'
import { MoreHorizontalIcon } from '@/components/icons'
import { format } from 'date-fns-jalali'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = ({ onChange }) => [
  {
    accessorKey: 'id',
    header: 'شناسه',
    className: 'fa',
  },
  {
    accessorKey: 'requester_mobile',
    header: 'موبایل درخواست کننده',
    className: 'fa',
  },
  {
    accessorKey: 'owner_mobile',
    header: 'موبایل مالک',
    className: 'fa',
  },
  {
    accessorKey: 'description',
    header: 'توضیحات',
    className: 'fa',
  },
  {
    accessorKey: 'visit_date',
    header: 'تاریخ بازدید',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      date ? format(date, 'yyyy/MM/dd') : ''
    },
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
            <DropdownMenuItem asChild>
              <Link to={`/ads/list/${ad.property_ad?.id}`}>مشاهده آگهی</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button className="w-full" onClick={() => onChange(ad)}>
                تغییر وضعیت
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { generateColumns }
