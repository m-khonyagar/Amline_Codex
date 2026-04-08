import { InvoiceStatusOptions } from '@/data/enums/invoice_enums'
import { cn } from '@/utils/dom'
import { findOption } from '@/utils/enum'
import { numberSeparator } from '@/utils/number'
import { format } from 'date-fns-jalali'

/** @type {import('@tanstack/react-table').ColumnDef<{}>[]} */
const columns = [
  {
    accessorKey: 'id',
    header: 'شناسه',
    className: 'fa',
  },
  {
    accessorKey: 'final_amount',
    header: 'مبلغ (تومان)',
    cell: ({ cell }) => numberSeparator(cell.getValue()),
  },
  {
    accessorKey: 'created_at',
    header: 'تاریخ ایجاد',
    cell: ({ cell }) => {
      const date = cell.getValue()
      return date ? format(date, 'yyyy MMMM dd - HH:ss') : ''
    },
  },
  {
    accessorKey: 'paid_at',
    header: 'تاریخ پرداخت',
    cell: ({ cell }) => {
      const date = cell.getValue()
      return date ? format(date, 'yyyy MMMM dd - HH:ss') : ''
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ cell }) => {
      const option = findOption(InvoiceStatusOptions, cell.getValue())
      return (
        <span
          className={cn({
            'text-teal-600': option.color == 'teal',
            'text-red-600': option.color == 'red',
          })}
        >
          {option?.label}
        </span>
      )
    },
  },
]

export { columns }
