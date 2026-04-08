import { useDataTable } from './DataTableProvider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table'
import { flexRender } from '@tanstack/react-table'
import { CircleLoadingIcon } from '@/components/icons'

const DataTableTable = ({
  isLoading = false,
  onRowClick,
  onRowDoubleClick,
  noResultMessage = 'No results.',
  rowClassName,
}) => {
  const { table, columns } = useDataTable()

  const handleRowClick = (e, row, id) => {
    if (e.detail === 1) {
      onRowClick?.(e, row, id)
    } else if (e.detail === 2) {
      onRowDoubleClick?.(e, row, id)
    }
  }
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} hover={false}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="whitespace-nowrap"
                  style={{ width: `${header.getSize()}px` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody className="relative">
        {isLoading && (
          <TableRow>
            <TableCell
              className="absolute top-0 left-0 w-full h-full bg-white/70 flex items-center justify-center"
              colSpan={columns.length}
            >
              <CircleLoadingIcon size={24} className="animate-spin mx-auto" />
            </TableCell>
          </TableRow>
        )}

        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={(e) => handleRowClick(e, row, row.id)}
              className={rowClassName?.(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={cell.column.columnDef.className}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {noResultMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default DataTableTable
