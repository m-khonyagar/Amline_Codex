import { cn } from '@/utils/dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { useDataTable } from './DataTableProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '../DropdownMenu'

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'

export default function DataTablePagination() {
  const { table } = useDataTable()

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  const generatePageNumbers = () => {
    const pages = []

    if (currentPage <= 4) {
      // Case 1: First 5 pages
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i)
      }
    } else if (currentPage > 4 && currentPage <= totalPages - 4) {
      // Case 2: Middle pages
      pages.push(currentPage - 1, currentPage, currentPage + 1)
    } else {
      // Case 3: Last pages
      for (let i = Math.max(totalPages - 4, 1); i <= totalPages; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <div className="w-full flex items-center flex-wrap px-2 gap-4 py-4 fa text-sm">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}

      {/* <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div> */}

      <div className="flex items-center gap-x-2">
        {/* <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronLeftIcon />
          </Button> */}
        <button
          className="h-8 w-8 p-0 rounded border text-gray-600 disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronRightIcon className="mx-auto" />
        </button>

        {currentPage > 5 && (
          <>
            <button
              className={cn('h-8 w-8 p-0 rounded border text-gray-600', {
                'bg-primary text-white': currentPage == 1,
              })}
              onClick={() => table.setPageIndex(0)}
            >
              1
            </button>
            {currentPage > 5 && <span>...</span>} {/* Ellipsis */}
          </>
        )}

        {generatePageNumbers().map((page) => (
          <button
            key={page}
            className={cn('h-8 w-8 p-0 rounded border text-gray-600', {
              'bg-primary text-white': page == currentPage,
            })}
            onClick={() => table.setPageIndex(page - 1)}
            disabled={page == currentPage}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages - 4 && (
          <>
            {currentPage < totalPages - 4 && <span>...</span>} {/* Ellipsis */}
            <button
              className={cn('h-8 w-8 p-0 rounded border text-gray-600', {
                'bg-primary text-white': currentPage == totalPages,
              })}
              onClick={() => table.setPageIndex(totalPages - 1)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 w-8 p-0 rounded border text-gray-600 disabled:opacity-50"
        >
          <span className="sr-only">Go to next page</span>
          <ChevronLeftIcon className="mx-auto" />
        </button>
        {/* <Button
            variant="ghost"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronRightIcon />
          </Button> */}
      </div>

      <div className="flex items-center mr-auto gap-4 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          مجموع: {table.getRowCount()} رکورد
        </div>

        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <button className="mr-auto h-8 text-sm border rounded-lg px-4 py-2 outline-none leading-none">
              {/* <SettingsIcon /> */}
              تعداد در هر صفحه: {table.getState().pagination.pageSize}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <DropdownMenuCheckboxItem
                key={pageSize}
                className="fa"
                checked={pageSize == table.getState().pagination.pageSize}
                onCheckedChange={() => table.setPageSize(pageSize)}
              >
                {pageSize}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
      </div>
    </div>
  )
}
