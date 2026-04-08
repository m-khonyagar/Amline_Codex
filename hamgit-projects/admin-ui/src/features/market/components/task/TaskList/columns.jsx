import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { MoreHorizontalIcon } from '@/components/icons'
import { TaskStatusLabels } from '@/data/enums/market_enums'
import { format } from 'date-fns-jalali'

/**
 * Column definitions for the task list table
 * @type {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = [
  {
    accessorKey: 'title',
    header: 'عنوان وظیفه',
    className: 'fa',
    size: 200,
  },
  {
    accessorKey: 'assigned_to_user',
    header: 'ارجاع به کارشناس',
    cell: ({ getValue }) => {
      const userName = getValue()?.fullname
      return userName || '-'
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      return status ? <Badge>{TaskStatusLabels[status]}</Badge> : '-'
    },
  },
  {
    accessorKey: 'due_date',
    header: 'مهلت انجام',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      return date ? format(new Date(date), 'dd MMMM yyyy - HH:mm') : '-'
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    enableHiding: false,
    enableColumnFilter: false,
    size: 50,
    cell: ({ row }) => {
      const task = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
              <MoreHorizontalIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            <DropdownMenuItem asChild>
              <Link to={`/market/task/${task.id}`}>مشاهده</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/market/task/${task.id}/edit`}>ویرایش</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { generateColumns }
