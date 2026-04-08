import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import useGetAllBaseClauses from '../api/get-base-clauses'
import { Page } from '@/features/misc'
import { ClauseProvider } from '../providers/ClauseProvider'
import ContractClausesList from '../components/ContractClausesList'
import { Skeleton } from '@/components/ui/Skeleton'

const CLAUSE_CATEGORIES = {
  default: { type: 'DEFAULT_CLAUSES', title: 'بندهای عادی' },
  guaranteed: { type: 'GUARANTEED_CLAUSES', title: 'بندهای ضمانتی' },
}

const LoadingSkeleton = () => (
  <Page title="بندهای پیش فرض قرارداد">
    <div className="max-w-6xl mx-auto space-y-2 mt-6">
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-11" />
      ))}
    </div>
  </Page>
)

const ClausesPage = () => {
  const { type } = useParams()
  const { data, isLoading } = useGetAllBaseClauses()

  const clauseCategory = CLAUSE_CATEGORIES[type]

  const clauses = useMemo(
    () => clauseCategory && data?.find((item) => item.clauses_type === clauseCategory.type),
    [data, clauseCategory]
  )

  if (!clauseCategory) return <Navigate to="/clauses/default" />
  if (isLoading) return <LoadingSkeleton />

  return (
    <ClauseProvider>
      <Page title="بندهای پیش فرض قرارداد">
        <ContractClausesList
          title={clauseCategory.title}
          type={clauseCategory.type}
          clauses={clauses}
        />
      </Page>
    </ClauseProvider>
  )
}

export default ClausesPage
