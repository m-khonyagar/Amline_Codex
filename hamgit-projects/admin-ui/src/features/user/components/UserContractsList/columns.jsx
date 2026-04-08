import { Link } from 'react-router-dom'
import { format } from 'date-fns-jalali'
import { PRCStatus } from '@/features/contract'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { partyType, partyTypeOptions } from '@/data/enums/prcontract-enums'
import { fullName } from '@/utils/dom'
import { translateEnum } from '@/utils/enum'
import { numberSeparator } from '@/utils/number'
import { MoreHorizontalIcon } from '@/components/icons'

/**
 * @returns {import('@tanstack/react-table').ColumnDef<{}>[]}
 */
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
    accessorKey: 'actions',
    header: '',
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
            <DropdownMenuItem asChild>
              <Link to={`/contracts/prs/${contract.id}`}>مشاهده</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export { columns }
