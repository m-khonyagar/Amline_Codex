import { cn } from '@/utils/dom'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useClauseContext } from '../providers/ClauseProvider'
import SortableItem from './SortableItem'

const SubclauseList = ({ parentId, subclauses }) => {
  const {
    actions: { setSubClauses, selectSubClause, selectForDelete },
  } = useClauseContext()
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = subclauses.findIndex((item) => item.id === active.id)
      const newIndex = subclauses.findIndex((item) => item.id === over.id)

      const newSubclauses = arrayMove(subclauses, oldIndex, newIndex).map((item, i) => ({
        ...item,
        subclause_number: i + 1,
      }))

      setSubClauses(parentId, newSubclauses)
    }
  }

  const subclauseIds = subclauses.map((item) => item.id)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ul className="flex flex-col gap-1.5 mt-2">
        <SortableContext items={subclauseIds} strategy={verticalListSortingStrategy}>
          {subclauses.map((subclause) => (
            <SortableItem key={subclause.id} id={subclause.id}>
              <div className="flex items-center flex-wrap gap-x-2">
                <h4 className="text-sm font-medium">
                  بند {subclause.subclause_number}: {subclause.subclause_name}
                </h4>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs',
                      subclause.is_editable ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {subclause.is_editable ? 'قابل ویرایش' : 'غیر قابل ویرایش'}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span
                    className={cn(
                      'text-xs',
                      subclause.is_deletable ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {subclause.is_deletable ? 'قابل حذف' : 'غیر قابل حذف'}
                  </span>
                </div>

                <div
                  className="flex items-center mr-auto gap-2"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => selectSubClause({ parentId, ...subclause })}
                    className="text-xs border px-4 py-1 rounded-md hover:text-teal-600 hover:bg-teal-50"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => selectForDelete({ parentId, ...subclause })}
                    className="text-xs border px-4 py-1 rounded-md hover:text-red-600 hover:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm">{subclause.body}</p>
            </SortableItem>
          ))}
        </SortableContext>
      </ul>
    </DndContext>
  )
}

export default SubclauseList
