import { useEffect, useMemo } from 'react'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableClause from './SortableClause'
import Button from '@/components/ui/Button'
import { useClauseContext } from '../providers/ClauseProvider'
import { Dialog } from '@/components/ui/Dialog'
import ClauseForm from './ClauseForm'
import SubClauseForm from './SubClauseForm'
import ClauseDelete from './ClauseDelete'
import { PlusIcon } from '@/components/icons'
import useUpdateBaseClauses from '../api/put-base-clauses'
import { toast } from '@/components/ui/Toaster'

const ContractClausesList = ({ title, type, clauses: initialClauses, className }) => {
  const {
    state: { clauses, selectedClause, selectedSubClause, selectedForDelete },
    actions: { setClauses, selectClause, selectSubClause, selectForDelete },
  } = useClauseContext()
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = clauses.findIndex((item) => item.id === active.id)
      const newIndex = clauses.findIndex((item) => item.id === over.id)
      setClauses(
        arrayMove(clauses, oldIndex, newIndex).map((item, i) => ({
          ...item,
          clause_number: i + 6,
        }))
      )
    }
  }

  const { mutate: updateBaseClauses, isPending } = useUpdateBaseClauses(initialClauses?.id)

  const handleSaveClauseChanges = () => {
    updateBaseClauses(
      {
        contract_type: 'PROPERTY_RENT',
        clauses_type: type,
        clauses,
      },
      {
        onSuccess: () => toast.success('بندهای پیش فرض با موفقیت ویرایش شد'),
        onError: () => toast.error('خطا در ویرایش بندهای پیش فرض'),
      }
    )
  }

  useEffect(() => {
    setClauses(initialClauses?.clauses || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClauses])

  const clauseIds = useMemo(() => clauses.map((clause) => clause.id), [clauses])

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <div className="flex item-center justify-between mb-4">
        <h2 className="text-xl font-medium">{title}</h2>

        <Button size="sm" onClick={() => selectClause({})}>
          <PlusIcon size={16} className="ml-2" />
          ایجاد ماده جدید
        </Button>
      </div>

      <div className="bg-white rounded-lg p-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <ul className="flex flex-col gap-3 fa">
            <SortableContext items={clauseIds} strategy={verticalListSortingStrategy}>
              {clauses.map((clause) => (
                <SortableClause key={clause.id} clause={clause} />
              ))}
            </SortableContext>
          </ul>
        </DndContext>
      </div>

      <div className="mt-4">
        <Button size="sm" loading={isPending} onClick={handleSaveClauseChanges}>
          ذخیره تغییرات
        </Button>
      </div>

      <Dialog
        title={selectedClause?.id ? 'ویرایش ماده' : 'ایجاد ماده جدید'}
        closeOnBackdrop={false}
        open={selectedClause}
        onOpenChange={() => selectClause(null)}
      >
        <ClauseForm
          clause={selectedClause}
          nextClauseNumber={clauses.length + 6}
          onCancel={() => selectClause(null)}
          onSuccess={() => selectClause(null)}
        />
      </Dialog>

      <Dialog
        title={selectedSubClause?.id ? 'ویرایش بند' : 'ایجاد بند جدید'}
        closeOnBackdrop={false}
        open={selectedSubClause}
        onOpenChange={() => selectSubClause(null)}
      >
        <SubClauseForm
          subClause={selectedSubClause}
          nextSubClauseNumber={
            clauses.find((clause) => clause.id === selectedSubClause?.parentId)?.subclauses.length +
            1
          }
          onCancel={() => selectSubClause(null)}
          onSuccess={() => selectSubClause(null)}
        />
      </Dialog>

      <Dialog
        title={selectedForDelete?.parentId ? 'حذف بند' : 'حذف ماده'}
        closeOnBackdrop={false}
        open={selectedForDelete}
        onOpenChange={() => selectForDelete(null)}
      >
        <ClauseDelete
          clause={selectedForDelete}
          onCancel={() => selectForDelete(null)}
          onSuccess={() => selectForDelete(null)}
        />
      </Dialog>
    </div>
  )
}

export default ContractClausesList
