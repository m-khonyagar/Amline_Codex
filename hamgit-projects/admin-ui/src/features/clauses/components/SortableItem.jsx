import { useSortable } from '@dnd-kit/sortable'

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: transform ? `translate3d(${transform?.x}px, ${transform?.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.6 : 1,
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
    cursor: 'grab',
    userSelect: 'none',
  }

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </li>
  )
}

export default SortableItem
