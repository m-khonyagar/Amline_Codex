import { MoreHorizontalIcon } from '@/components/icons'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import {
  userGenderTranslation,
  userRolesTranslation,
  userCallStatusEnum,
} from '@/data/enums/user-enums'
import { numberSeparator } from '@/utils/number'
import { format } from 'date-fns-jalali'
import { Link } from 'react-router-dom'

/** @type {import('@tanstack/react-table').ColumnDef<{}>[]} */
const columns = [
  // {
  //   accessorKey: 'id',
  //   header: 'شناسه',
  //   className: 'fa',
  // },
  {
    accessorKey: 'mobile',
    header: 'موبایل',
    className: 'fa',
  },
  {
    accessorKey: 'first_name',
    header: 'نام',
    className: 'fa',
  },
  {
    accessorKey: 'last_name',
    header: 'نام خانوادگی',
    className: 'fa',
  },
  {
    accessorKey: 'gender',
    header: 'جنسیت',
    className: 'fa',
    cell: ({ getValue }) => userGenderTranslation[getValue()] || '-',
  },
  {
    accessorKey: 'national_code',
    header: 'کد ملی',
    className: 'fa',
  },
  {
    accessorKey: 'birth_date',
    header: 'تاریخ تولد',
    className: 'fa',
    cell: ({ row }) => {
      const date = row.getValue('birth_date')

      return date ? format(date, 'yyyy/MM/dd') : ''
    },
  },
  {
    id: 'status',
    accessorKey: 'last_call_status',
    header: 'وضعیت تماس',
    className: 'fa',
    cell: ({ getValue }) => {
      const status = getValue()
      return status ? userCallStatusEnum.find((opt) => opt.value === status)?.label || '-' : '-'
    },
  },
  {
    accessorKey: 'roles',
    header: 'نقش‌ها',
    className: 'fa',
    cell: ({ row }) => {
      const roles = row.getValue('roles')
      return Array.isArray(roles) && roles?.length > 0
        ? roles.map((role) => userRolesTranslation[role] || '').join(', ')
        : '-'
    },
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    className: 'fa',
    cell: ({ row }) => {
      const date = row.getValue('created_at')

      return (
        <span className="whitespace-nowrap">{date ? format(date, 'yyyy/MM/dd - HH:mm') : ''}</span>
      )
    },
  },
  {
    accessorKey: 'last_login',
    header: 'آخرین ورود',
    className: 'fa',
    cell: ({ row }) => {
      const date = row.getValue('last_login')

      return (
        <span className="whitespace-nowrap">{date ? format(date, 'yyyy/MM/dd - HH:mm') : ''}</span>
      )
    },
  },
  {
    accessorKey: 'wallet',
    header: (
      <>
        کیف پول <span className="text-xs font-normal">(تومان)</span>
      </>
    ),
    className: 'fa',
    cell: ({ cell }) => {
      const wallet = cell.getValue()

      return wallet?.credit ? numberSeparator(wallet.credit) : '-'
    },
  },
  {
    accessorKey: 'labels',
    header: 'برچسب',
    cell: ({ row }) => {
      const labels = row.getValue('labels')
      return (
        <>
          {Array.isArray(labels) && labels.length > 0
            ? labels?.map((item) => (
                <Badge key={item.id} variant="outline" className="m-0.5 text-xs">
                  {item.title}
                </Badge>
              ))
            : '-'}
        </>
      )
    },
  },
  {
    accessorKey: 'actions',
    header: '',
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const user = row.original
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
              <Link to={`/users/${user.id}`}>مشاهده</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/users/${user.id}/edit`}>ویرایش</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { columns }
