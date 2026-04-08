import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetPRContractCommissions } from '../../api/get-pr-contract-commissions'
import { useGetPRContractStatus } from '../../api/get-pr-contract-status'
import PRContractCommissionItem from './PRContractCommissionItem'
import { cn } from '@/utils/dom'

const PRContractCommissions = ({ contractId }) => {
  const prContractStatusQuery = useGetPRContractStatus(contractId)
  const prContractCommissionsQuery = useGetPRContractCommissions(contractId)

  const steps = prContractStatusQuery.data?.steps || {}
  const commissions = prContractCommissionsQuery.data

  const commissionSteps = {
    LANDLORD: steps.LANDLORD_COMMISSION,
    TENANT: steps.TENANT_COMMISSION,
  }

  return (
    <div>
      <LoadingAndRetry query={prContractCommissionsQuery} checkRefetching>
        {commissions?.length == 0 && (
          <div className="p-4 text-orange-600">کمیسیونی برای این قراداد ثبت نشده است</div>
        )}

        {commissions?.length > 0 && (
          <div className="mt-4 py-4 flex flex-wrap bg-white rounded-lg">
            {commissions.map((c, i) => (
              <PRContractCommissionItem
                key={c.id}
                commission={c}
                contractId={contractId}
                paidBySystem={commissionSteps[c.payer_party_type]}
                className={cn('md:basis-1/2 py-2 px-4 flex-grow', {
                  'border-t md:border-t-0 md:border-r': i != 0,
                })}
              />
            ))}
          </div>
        )}
      </LoadingAndRetry>
    </div>
  )
}

export default PRContractCommissions
