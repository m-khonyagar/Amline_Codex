import { cn } from '@/utils/dom'
import { format } from 'date-fns-jalali'
import { numberSeparator } from '@/utils/number'
import { findOption, translateEnum } from '@/utils/enum'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import {
  paymentTypeOptions,
  paymentMethodOptions,
  paymentStatusOptions,
} from '@/data/enums/prcontract-enums'
import { MoreHorizontalIcon } from '@/components/icons'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = ({ onDelete, onView, onSend, onApplyPromo }) => [
  {
    accessorKey: 'id',
    header: 'شناسه',
    className: 'fa',
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ',
    className: 'fa',
    cell: ({ cell }) => {
      if (typeof cell.row.original?.invoice?.final_amount === 'number')
        return numberSeparator(cell.row.original?.invoice?.final_amount)

      return numberSeparator(cell.getValue())
    },
  },
  {
    accessorKey: 'type',
    header: 'نوع',
    cell: ({ cell }) => {
      const option = findOption(paymentTypeOptions, cell.getValue())

      return (
        <span
          className={cn('px-2 text-sm rounded-md', {
            'bg-rust-100 text-rust-600': option.color == 'rust',
            'bg-teal-100 text-teal-800': option.color == 'teal',
            'bg-orange-100 text-orange-600': option.color == 'orange',
          })}
        >
          {option?.label}
        </span>
      )
    },
  },
  {
    accessorKey: 'method',
    header: 'روش پرداخت',
    cell: ({ cell }) => translateEnum(paymentMethodOptions, cell.getValue()),
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ cell }) => translateEnum(paymentStatusOptions, cell.getValue()),
  },
  {
    accessorKey: 'due_date',
    header: 'تاریخ سررسید',
    className: 'fa',
    cell: ({ cell }) => {
      const date = cell.getValue()
      return date ? format(date, 'yyyy/MM/dd') : ''
    },
  },
  {
    accessorKey: 'description',
    header: 'توضیحات',
    className: 'fa',
    maxSize: 150,
    cell: ({ cell }) => cell.getValue() || '-',
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

            <DropdownMenuItem>
              ویرایش
              {/* <Link to={`/contracts/prs/${contract.id}`}>ویرایش</Link> */}
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={row.original?.status === 'PAID'}
              onClick={() => onSend(row.original)}
            >
              ساخت لینک
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={!row.original?.invoice?.id}
              onClick={() => onApplyPromo(row.original)}
            >
              اعمال کد تخفیف
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
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
