// import { memo } from 'react'
import { cn } from '@/utils/dom'
import { useDataTable } from '@/components/ui/DataTable'
import { paymentTypeOptions } from '@/data/enums/prcontract-enums'

const paymentTypeFilters = paymentTypeOptions

const PRContractPaymentListFilters = () => {
  const { table } = useDataTable()

  return (
    <div className="flex gap-2">
      <div className="flex items-start gap-2">
        <div>نوع پرداخت:</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={cn('border rounded-md px-2 text-sm', {
            'bg-gray-200 border-gray-600 text-gray-800 shadow-md':
              table.getColumn('type').getFilterValue() == null,
          })}
          onClick={() => table.getColumn('type').setFilterValue(null)}
        >
          همه
        </button>

        {paymentTypeFilters.map((f) => (
          <button
            key={f.value}
            className={cn('border rounded-md px-2 text-sm', {
              'bg-gray-200 border-gray-600 text-gray-800 shadow-md':
                table.getColumn('type').getFilterValue() == f.value,
            })}
            onClick={() => table.getColumn('type').setFilterValue(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PRContractPaymentListFilters
