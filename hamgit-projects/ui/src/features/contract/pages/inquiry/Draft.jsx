import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useGetContractInquiryQuery } from '../../api/get-contracts-inquire'
import { HeaderNavigation } from '@/features/app'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import ContractContent from '../../components/Draft/ContractContent'
import CollapseBox from '@/components/ui/CollapseBox'
import SubClause from '../../components/Draft/SubClause'

export default function DraftInquiryContractPage() {
  const router = useRouter()
  const { key, password } = router.query

  const getContractInquiryQuery = useGetContractInquiryQuery(key, password)

  const data = useMemo(() => getContractInquiryQuery?.data, [getContractInquiryQuery?.data])

  return (
    <>
      <HeaderNavigation title="استعلام قرارداد" />

      <div className="flex flex-col p-5 gap-6 flex-grow">
        <LoadingAndRetry query={getContractInquiryQuery} skeletonItemCount={7}>
          {data && (
            <>
              <ContractContent
                statuses={{}}
                parties={data.parties}
                property={data.property}
                payments={data.payments}
                contract={data}
                showFullDetails
              />
              {data.clauses.length > 0 && (
                <div className="bg-background rounded-2xl p-4 shadow-xl fa">
                  <CollapseBox
                    label={` ماده ${data.clauses[0].clause_number}: ${data.clauses[0].clause_name}`}
                  >
                    <div className="divide-y">
                      {data.clauses.map((subClause) => (
                        <SubClause
                          subClause={subClause}
                          key={subClause.id}
                          canEdit={false}
                          property={data.property}
                          contract={data}
                        />
                      ))}
                    </div>
                  </CollapseBox>
                </div>
              )}
            </>
          )}
        </LoadingAndRetry>
      </div>
    </>
  )
}
