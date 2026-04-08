import { MoreHorizontalIcon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { partyType, partyTypeOptions } from '@/data/enums/prcontract-enums'
import { fullName } from '@/utils/dom'
import { translateEnum } from '@/utils/enum'
import { numberSeparator } from '@/utils/number'
import { format } from 'date-fns-jalali'
import { Link } from 'react-router-dom'
import PRCStatus from '../PRCStatus'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
const generateColumns = ({ onDelete, onChangeColor, showActions = true }) => {
  const columns = [
    {
      accessorKey: 'id',
      header: 'شناسه',
      className: 'fa',
    },
    {
      accessorKey: 'owner_type',
      header: 'شروع کننده',
      cell: ({ row, column }) => {
        return translateEnum(partyTypeOptions, row.getValue(column.id))
      },
    },
    {
      accessorKey: 'status',
      header: 'وضعیت',
      cell: ({ row }) => {
        return <PRCStatus status={row.original.status} state={row.original.state} />
      },
      // render: (_, row) => <PRCStatus status={row.status} state={row.state} />,
    },
    {
      accessorKey: 'date',
      header: 'تاریخ',
      cell: ({ row, column }) => {
        const date = row.getValue(column.id)
        return date ? format(date, 'yyyy/MM/dd') : ''
      },
    },
    {
      accessorKey: 'handover_date',
      header: 'تاریخ تحویل',
      cell: ({ row, column }) => {
        const date = row.getValue(column.id)
        return date ? format(date, 'yyyy/MM/dd') : ''
      },
    },
    {
      accessorKey: 'start_date',
      header: 'تاریخ شروع',
      cell: ({ row, column }) => {
        const date = row.getValue(column.id)
        return date ? format(date, 'yyyy/MM/dd') : ''
      },
    },
    {
      accessorKey: 'end_date',
      header: 'تاریخ پایان',
      cell: ({ row, column }) => {
        const date = row.getValue(column.id)
        return date ? format(date, 'yyyy/MM/dd') : ''
      },
    },
    {
      accessorKey: 'deposit',
      header: 'مبلغ رهن',
      cell: ({ cell }) => numberSeparator(cell.getValue()),
    },
    {
      accessorKey: 'rent',
      header: 'مبلغ اجاره',
      cell: ({ cell }) => numberSeparator(cell.getValue()),
    },
    {
      accessorKey: 'landlord',
      header: 'نام مالک',
      cell: ({ row }) => {
        const landlord = row.original.parties?.find((p) => p.party_type == partyType.LANDLORD)

        return fullName(landlord)
      },
    },
    {
      accessorKey: 'landlord_mobile',
      header: 'موبایل مالک',
      cell: ({ row }) => {
        const landlord = row.original.parties?.find((p) => p.party_type == partyType.LANDLORD)

        return landlord?.mobile
      },
    },
    {
      accessorKey: 'tenant',
      header: 'نام مستاجر',
      cell: ({ row }) => {
        const tenant = row.original.parties?.find((p) => p.party_type == partyType.TENANT)

        return fullName(tenant)
      },
    },
    {
      accessorKey: 'tenant_mobile',
      header: 'موبایل مستاجر',
      cell: ({ row }) => {
        const tenant = row.original.parties?.find((p) => p.party_type == partyType.TENANT)

        return tenant?.mobile
      },
    },
    {
      accessorKey: 'created_at',
      header: 'تاریخ ایجاد',
      cell: ({ getValue }) => {
        const date = getValue()
        return date ? format(date, 'yyyy/MM/dd') : ''
      },
    },
  ]

  if (showActions) {
    columns.push({
      accessorKey: 'actions',
      header: '',
      enableHiding: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const contract = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 w-8 p-0 flex items-center justify-center outline-none rounded-lg hover:bg-gray-200">
                <MoreHorizontalIcon />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent dir="rtl" align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contract.id)}>
                کپی شناسه
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to={`/contracts/prs/${contract.id}`}>مشاهده</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onChangeColor?.(row.original)}>
                تغییر رنگ
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
    })
  }

  return columns
}

export { generateColumns }
