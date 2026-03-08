import { useState } from 'react'
import { cn } from '@/utils/dom'
import useCollapse from '@/hooks/use-collapse'
import { numberSeparator } from '@/utils/number'
import { ChevronLeftIcon } from '@/components/icons'
import { PropertyTypeOptions } from '@/data/enums/property-enums'

const ClauseBody = ({ body, replacements }) => {
  if (!replacements || Object.keys(replacements).length === 0) return <span>{body}</span>

  const regex = new RegExp(
    Object.keys(replacements)
      .map((r) => `(${r})`)
      .join('|'),
    'g'
  )

  const parts = body.split(regex)

  return (
    <span>
      {parts.map((part, index) =>
        replacements[part] ? (
          <span key={index} className="text-teal-600 font-bold underline underline-offset-4">
            {replacements[part]}
          </span>
        ) : (
          part
        )
      )}
    </span>
  )
}

const PRContractClauseItem = ({ clause, defaultOpen, prContract, property, onEdit, onDelete }) => {
  const [collapsed, setCollapsed] = useState(!defaultOpen)

  const { ref } = useCollapse(!collapsed)

  const propertyType = PropertyTypeOptions.find((i) => i.value === property?.property_type)?.label

  const replacements = {
    '<tenant_count>': prContract?.tenant_family_members_count || '-',
    '<property_type>': propertyType || '-',
    '<tenant_penalty_fee>': prContract?.tenant_penalty_fee
      ? numberSeparator(prContract?.tenant_penalty_fee)
      : '-',
    '<landlord_penalty_fee>': prContract?.landlord_penalty_fee
      ? numberSeparator(prContract?.landlord_penalty_fee)
      : '-',
  }

  return (
    <div className="fa px-4">
      <h3
        className="flex items-center border-b cursor-pointer py-2"
        onClick={() => setCollapsed((s) => !s)}
      >
        <span className="font-semibold">
          ماده {clause.clause_number}
          {clause.clause_name && `: ${clause.clause_name}`}
        </span>

        <ChevronLeftIcon
          size={16}
          className={cn('mr-auto transition-transform duration-200', {
            '-rotate-90': !collapsed,
          })}
        />
      </h3>

      <div ref={ref} className="overflow-hidden transition-all duration-300 flex flex-col">
        {clause.subclauses.map((subclause, i) => (
          <div key={subclause.id} className="mt-1 hover:bg-gray-100 rounded-lg px-2 py-2">
            <div className="flex items-center flex-wrap gap-x-2 mb-1">
              <h4 className="font-medium">
                بند {i + 1}: {subclause.subclause_name}
              </h4>
              <div className="flex items-center gap-2 text-gray-300">
                <span
                  className={cn('text-xs', clause.is_editable ? 'text-green-600' : 'text-red-600')}
                >
                  {clause.is_editable ? 'قابل ویرایش' : 'غیر قابل ویرایش'}
                </span>
                |
                <span
                  className={cn('text-xs', clause.is_deletable ? 'text-green-600' : 'text-red-600')}
                >
                  {clause.is_deletable ? 'قابل حذف' : 'غیر قابل حذف'}
                </span>
              </div>

              <div className="flex items-center mr-auto gap-2">
                <button
                  onClick={() => onEdit(subclause)}
                  className="text-xs border px-4 py-1 rounded-md hover:text-teal-600 hover:bg-teal-50"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => onDelete(subclause)}
                  className="text-xs border px-4 py-1 rounded-md hover:text-red-600 hover:bg-red-50"
                >
                  حذف
                </button>
              </div>
            </div>

            <div className="text-sm leading-normal text-justify">
              <ClauseBody body={subclause.body} replacements={replacements} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PRContractClauseItem
