import { cn } from '@/utils/dom'
import DataTableTable from './DataTableTable'
import DataTablePagination from './DataTablePagination'
import { DataTableProvider } from './DataTableProvider'
import { DataTableViewOptions } from './DataTableViewOptions'
import { createElement } from 'react'
import { CircleLoadingIcon, RefreshIcon } from '@/components/icons'

const DataTable = ({
  columns,
  data,
  rowCount = 10,
  className,
  isLoading,
  onRowClick,
  onRefresh,
  onRowDoubleClick,
  filtersComponent,
  initialFilters,
  initialPagination,
  initialGlobalFilter,
  initialColumnVisibility,
  onChange,
  showViewOptions = true,
  showPagination = true,
  noResultMessage = 'هیچ دادهای یافت نشد.',
  rowClassName,
}) => {
  return (
    <DataTableProvider
      data={data}
      columns={columns}
      rowCount={rowCount}
      initialFilters={initialFilters}
      initialPagination={initialPagination}
      initialGlobalFilter={initialGlobalFilter}
      initialColumnVisibility={initialColumnVisibility}
      onChange={onChange}
    >
      <div className={cn('rounded-md border', className)}>
        {/* <Input
          placeholder="جستجو"
          value={table.getColumn('mobile')?.getFilterValue() ?? ''}
          onChange={(event) => table.getColumn('mobile')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        /> */}

        <div className="flex p-4 flex-wrap gap-4">
          {filtersComponent && createElement(filtersComponent)}

          {(showViewOptions || onRefresh) && (
            <div className="mr-auto flex gap-2">
              {showViewOptions && <DataTableViewOptions />}

              {onRefresh && (
                <button
                  className="h-8 min-w-8 text-sm text-center border rounded-lg px-4 py-2 outline-none leading-none"
                  onClick={onRefresh}
                  title="بارگزاری مجدد"
                >
                  {isLoading ? (
                    <CircleLoadingIcon className="animate-spin mx-auto" size={14} />
                  ) : (
                    <RefreshIcon className="mx-auto" size={14} />
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        <DataTableTable
          isLoading={isLoading}
          onRowClick={onRowClick}
          noResultMessage={noResultMessage}
          onRowDoubleClick={onRowDoubleClick}
          rowClassName={rowClassName}
        />

        {showPagination && <DataTablePagination />}
      </div>
    </DataTableProvider>
  )
}

export default DataTable
