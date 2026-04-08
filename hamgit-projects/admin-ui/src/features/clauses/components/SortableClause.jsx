import { useState } from 'react'
import { cn } from '@/utils/dom'
import useCollapse from '@/hooks/use-collapse'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import SortableItem from './SortableItem'
import SubclauseList from './SubclauseList'
import { useClauseContext } from '../providers/ClauseProvider'
import { ChevronLeftIcon, CloseIcon, PencilIcon, PlusIcon } from '@/components/icons'

const SortableClause = ({ clause }) => {
  const {
    actions: { selectClause, selectSubClause, selectForDelete },
  } = useClauseContext()
  const [collapsed, setCollapsed] = useState(true)
  const { ref } = useCollapse(!collapsed, { dependency: clause?.subclauses?.length })

  return (
    <SortableItem id={clause.id}>
      <div className="flex items-center flex-wrap gap-x-2">
        <h3 className="font-medium">
          ماده {clause.clause_number}: {clause.clause_name}
        </h3>

        {clause.subclauses && clause.subclauses.length > 0 && (
          <ChevronLeftIcon
            size={24}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setCollapsed((s) => !s)}
            className={cn('mr-1 cursor-pointer transition-transform duration-200 p-0.5', {
              '-rotate-90': !collapsed,
            })}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mr-auto text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2">
              <PencilIcon size={16} />
              عملیات
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent onPointerDown={(e) => e.stopPropagation()} dir="rtl" align="end">
            <DropdownMenuItem onClick={() => selectSubClause({ parentId: clause.id })}>
              <PlusIcon size={16} />
              ایجاد بند جدید
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => selectClause(clause)}>
              <PencilIcon size={16} />
              ویرایش
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => selectForDelete(clause)}>
              <CloseIcon size={16} />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {clause.subclauses && clause.subclauses.length > 0 && (
        <div ref={ref} className="overflow-hidden transition-all duration-300 flex flex-col">
          <SubclauseList parentId={clause.id} subclauses={clause.subclauses} />
        </div>
      )}
    </SortableItem>
  )
}

export default SortableClause
