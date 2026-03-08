import { MoreHorizontalIcon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { fullName } from '@/utils/dom'
import { format } from 'date-fns-jalali'
import SettlementRequestStatus from '../SettlementRequestStatus'
import { numberSeparator } from '@/utils/number'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = ({ onView }) => [
  {
    accessorKey: 'id',
    header: 'شناسه',
  },
  {
    accessorKey: 'user',
    header: 'نام',
    cell: ({ cell }) => {
      const user = cell.getValue()
      return fullName(user)
    },
  },
  {
    accessorKey: 'user.mobile',
    header: 'موبایل',
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    cell: ({ cell }) => {
      const date = cell.getValue()

      return date ? format(date, 'yyyy/MM/dd') : '-'
    },
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ',
    cell: ({ cell }) => numberSeparator(cell.getValue()),
  },
  {
    accessorKey: 'description',
    header: 'توضیحات',
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ cell }) => <SettlementRequestStatus status={cell.getValue()} />,
  },
  {
    accessorKey: 'actions',
    header: '',
    enableHiding: false,
    enableColumnFilter: false,
    size: 50,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
              <MoreHorizontalIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>مشاهده</DropdownMenuItem>

            {/* <DropdownMenuItem>
              ویرایش
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { generateColumns }
