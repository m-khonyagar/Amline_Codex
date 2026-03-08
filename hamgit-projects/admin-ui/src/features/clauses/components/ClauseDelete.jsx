import Button from '@/components/ui/Button'
import { CloseIcon } from '@/components/icons'
import { useClauseContext } from '../providers/ClauseProvider'

const ClauseDelete = ({ clause, onSuccess, onCancel }) => {
  const isSubClause = !!clause?.parentId

  const {
    actions: { removeClause, removeSubclause },
  } = useClauseContext()

  const handleSubmit = () => {
    isSubClause ? removeSubclause(clause.parentId, clause.id) : removeClause(clause.id)
    onSuccess?.()
  }

  const clauseText = isSubClause
    ? `بند ${clause?.subclause_number}: ${clause?.subclause_name || ''}`
    : `ماده ${clause?.clause_number}: ${clause?.clause_name || ''}`

  return (
    <div className="fa">
      <div>
        آیا از حذف <span className="font-bold">{clauseText}</span> مطمئن هستید؟
      </div>

      {!isSubClause && <div>با حذف این ماده همه بندهای این ماده حذف خواهند شد.</div>}

      <div className="mt-4 flex items-center justify-end">
        <Button size="sm" variant="gray" onClick={onCancel}>
          <CloseIcon size={14} className="ml-1" /> انصراف
        </Button>

        <Button size="sm" className="mr-2" variant="danger" onClick={handleSubmit}>
          حذف
        </Button>
      </div>
    </div>
  )
}

export default ClauseDelete
