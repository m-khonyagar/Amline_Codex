import { Badge } from '@/components/ui/Badge'
import { toast } from '@/components/ui/Toaster'
import { discountTypeOptions, resourceTypeOptions } from '@/data/enums/invoice_enums'
import { userRolesOptions } from '@/data/enums/user-enums'
import { translateEnum } from '@/utils/enum'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = () => [
  {
    accessorKey: 'code',
    header: 'کد تخفیف',
    className: 'fa',
    cell: ({ getValue }) => {
      const code = getValue()
      return code ? (
        <span
          className="font-mono bg-gray-100 px-2 py-1 rounded cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(code)
            toast.success('کد تخفیف کپی شد')
          }}
        >
          {code}
        </span>
      ) : (
        '-'
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'نوع تخفیف',
    className: 'fa',
    cell: ({ getValue }) => {
      const type = getValue()
      return type ? (
        <Badge variant="secondary">{translateEnum(discountTypeOptions, type)}</Badge>
      ) : (
        '-'
      )
    },
  },
  {
    accessorKey: 'value',
    header: 'مقدار',
    className: 'fa',
    cell: ({ getValue, row }) => {
      const value = getValue()
      const type = row.original.type
      if (!value) return '-'

      return type === 'PERCENTAGE' ? `${value}%` : `${value.toLocaleString('fa-IR')} تومان`
    },
  },
  {
    accessorKey: 'is_active',
    header: 'وضعیت',
    className: 'fa',
    cell: ({ getValue }) => {
      const isActive = getValue()
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'فعال' : 'غیرفعال'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'usage_limit',
    header: 'حد مجاز استفاده',
    className: 'fa',
    cell: ({ getValue }) => {
      const limit = getValue()
      return limit ? limit.toLocaleString('fa-IR') : 'نامحدود'
    },
  },
  {
    accessorKey: 'used_counts',
    header: 'تعداد استفاده شده',
    className: 'fa',
    cell: ({ getValue }) => {
      const used = getValue()
      return used ? used.toLocaleString('fa-IR') : '0'
    },
  },
  {
    accessorKey: 'specified_roles',
    header: 'نقش‌های مجاز',
    className: 'fa',
    cell: ({ getValue }) => {
      const roles = getValue()
      if (!roles || roles.length === 0) return 'همه'

      return roles.map((role) => translateEnum(userRolesOptions, role)).join(', ')
    },
  },
  {
    accessorKey: 'starts_at',
    header: 'شروع اعتبار',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return 'نامحدود'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'ends_at',
    header: 'پایان اعتبار',
    className: 'fa',
    cell: ({ getValue }) => {
      const date = getValue()
      if (!date) return 'نامحدود'
      return new Date(date).toLocaleDateString('fa-IR')
    },
  },
  {
    accessorKey: 'resource_type',
    header: 'نوع منبع',
    className: 'fa',
    cell: ({ getValue }) => {
      const resourceType = getValue()
      return resourceType ? (
        <Badge variant="secondary">{translateEnum(resourceTypeOptions, resourceType)}</Badge>
      ) : (
        '-'
      )
    },
  },
  {
    accessorKey: 'specified_user_phone',
    header: 'شماره تلفن',
    className: 'fa',
    cell: ({ getValue }) => {
      const phone = getValue()
      return phone || '-'
    },
  },
  // {
  //   accessorKey: 'actions',
  //   header: '',
  //   enableHiding: false,
  //   enableColumnFilter: false,
  //   cell: ({ row }) => {
  //     const file = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
  //             <MoreHorizontalIcon />
  //           </button>
  //         </DropdownMenuTrigger>

  //         <DropdownMenuContent dir="rtl" align="end">
  //           <DropdownMenuItem asChild>
  //             <Link to={`/market/deposit-rent/tenant/${file.id}`}>مشاهده</Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem asChild>
  //             <Link to={`/market/deposit-rent/tenant/${file.id}/edit`}>ویرایش</Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]

export { generateColumns }
