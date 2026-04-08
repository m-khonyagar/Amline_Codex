import { createContext, useContext, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'

/**
 * @typedef TDataTableContext
 * @property {import('@tanstack/react-table').ColumnDef<{}>[]} columns
 * @property {import('@tanstack/react-table').Table} table
 */

/** @type {import('react').Context<TDataTableContext>} */
const DataTableContext = createContext({})

const useDataTable = () => {
  const context = useContext(DataTableContext)

  if (context === undefined) {
    console.warn('useDataTable was used outside of its Provider')
  }

  return context
}

const DataTableProvider = ({
  data,
  columns,
  children,
  rowCount = 10,
  initialFilters = [],
  initialPagination = { pageIndex: 0, pageSize: 10 },
  initialGlobalFilter = '',
  initialColumnVisibility = {},
  onChange,
}) => {
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility)
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState(initialPagination)
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter)
  const [columnFilters, setColumnFilters] = useState(initialFilters)

  const handlePaginationChange = (getPagination) => {
    const newPagination = getPagination(pagination)
    setPagination(newPagination)
    onChange?.(newPagination)
  }

  const handleGlobalFilterChange = (filter) => {
    setGlobalFilter(filter)
    onChange?.({ search: filter, pageIndex: 0 })
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const handleFilterChange = (getFilters) => {
    const newFilters = getFilters(columnFilters)
    setColumnFilters(newFilters)

    const filters = {}

    newFilters.forEach((filter) => {
      filters[filter.id] = filter.value
    })

    columnFilters.forEach((filter) => {
      if (!filters[filter.id]) filters[filter.id] = null
    })

    onChange?.({ ...filters, pageIndex: 0 })
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const table = useReactTable({
    data,
    columns,
    rowCount: rowCount,
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    onPaginationChange: handlePaginationChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleFilterChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      // sorting,
      pagination,
      rowSelection,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
  })

  const value = useMemo(() => ({ table, columns }), [table, columns])

  return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export { useDataTable, DataTableProvider }
