import { cn } from '@/utils/dom'
import { useMemo, useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import PRContractClauseItem from './PRContractClauseItem'
import { PencilIcon, PlusIcon } from '@/components/icons'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import PRContractClauseDelete from './PRContractClauseDelete'
import PRContractClauseCreation from './PRContractClauseCreation'
import { useGetContractClauses } from '../../api/get-contract-clauses'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import { useGetPRContractProperty } from '../../api/get-pr-contract-property'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

const PRContractClauses = ({ contractId, className }) => {
  const [selectedClause, setSelectedClause] = useState(null)
  const [selectedClauseForDelete, setSelectedClauseForDelete] = useState(null)

  const prContractQuery = useGetPRContractInfo(contractId)
  const contractClausesQuery = useGetContractClauses(contractId)
  const prContractPropertyQuery = useGetPRContractProperty(contractId)

  const clauses = useMemo(() => {
    const data = contractClausesQuery.data || []

    const groupe_clauses = data.reduce((acc, item) => {
      const clauseNum = item.clause_number
      if (!acc[clauseNum]) {
        acc[clauseNum] = {
          clause_number: clauseNum,
          clause_name: item.clause_name,
          subclauses: [],
        }
      }
      acc[clauseNum].subclauses.push(item)
      return acc
    }, {})

    return Object.values(groupe_clauses)
      .map((group) => ({
        ...group,
        subclauses: group.subclauses.sort((a, b) => a.subclause_number - b.subclause_number),
      }))
      .sort((a, b) => a.clause_number - b.clause_number)
  }, [contractClausesQuery.data])

  return (
    <div className={cn(className)}>
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mr-auto text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2">
              <PencilIcon size={16} />
              عملیات
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            <DropdownMenuItem onClick={() => setSelectedClause({})}>
              <PlusIcon size={16} />
              ایجاد بند جدید
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LoadingAndRetry query={[contractClausesQuery, prContractQuery]} checkRefetching>
        {clauses?.length == 0 && (
          <div className="p-4 text-orange-600">بند قراردادی ایجاد نشده است.</div>
        )}

        {clauses?.length > 0 && (
          <div className="max-w-6xl mx-auto flex flex-col gap-4 bg-white rounded-lg py-4">
            {clauses.map((clause, i) => (
              <PRContractClauseItem
                clause={clause}
                defaultOpen={i == 0}
                key={clause.clause_number}
                prContract={prContractQuery.data}
                property={prContractPropertyQuery.data}
                onEdit={(c) => setSelectedClause(c)}
                onDelete={(c) => setSelectedClauseForDelete(c)}
              />
            ))}
          </div>
        )}
      </LoadingAndRetry>

      <Dialog
        title={selectedClause?.id ? 'ویرایش بند' : 'ایجاد بند'}
        closeOnBackdrop={false}
        open={selectedClause}
        onOpenChange={() => setSelectedClause(null)}
      >
        <PRContractClauseCreation
          clause={selectedClause}
          contractId={contractId}
          onCancel={() => setSelectedClause(null)}
          onSuccess={() => setSelectedClause(null)}
        />
      </Dialog>

      <Dialog
        title="حذف بند"
        closeOnBackdrop={false}
        open={selectedClauseForDelete}
        onOpenChange={(s) => setSelectedClauseForDelete(s)}
      >
        <PRContractClauseDelete
          contractId={contractId}
          clause={selectedClauseForDelete}
          onCancel={() => setSelectedClauseForDelete(null)}
          onSuccess={() => setSelectedClauseForDelete(null)}
        />
      </Dialog>
    </div>
  )
}

export default PRContractClauses
