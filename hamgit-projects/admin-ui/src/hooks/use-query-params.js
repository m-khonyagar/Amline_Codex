import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useDataTableQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const pagination = {
    pageIndex: Number(searchParams.get('pageIndex')) || 0,
    pageSize: Number(searchParams.get('pageSize')) || 10,
  }

  const globalFilter = searchParams.get('search') || ''
  const filters = []

  searchParams.forEach((value, key) => {
    if (key !== 'pageIndex' && key !== 'pageSize' && key !== 'search') {
      filters.push({ id: key, value })
    }
  })

  const updateQueryParams = useCallback(
    (newParams) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        Object.entries(newParams).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') params.delete(key)
          else params.set(key, value.toString())
        })
        return params
      })
    },
    [setSearchParams]
  )

  return { pagination, globalFilter, filters, searchParams, updateQueryParams }
}
