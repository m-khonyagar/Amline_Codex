import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import { translateEnum } from '@/utils/enum'
import { partyTypeOptions } from '@/data/enums/prcontract-enums'
import PRCStatus from '../PRCStatus'
import { cn } from '@/utils/dom'

const PRContractInfo = ({ contractId }) => {
  const prContractQuery = useGetPRContractInfo(contractId)

  const prContract = prContractQuery.data

  return (
    <div className="border rounded-lg bg-white p-4 fa flex items-center flex-wrap">
      <LoadingAndRetry query={prContractQuery}>
        {prContract && (
          <>
            <div>
              <div className="flex items-center">
                <div className="text-sm text-gray-700">شناسه:</div>
                <div className="mr-2">{prContract.contract.id}</div>
              </div>

              <div className="flex items-center mt-2">
                <div className="text-sm text-gray-700">شروع کننده:</div>
                <div className="mr-2">
                  {translateEnum(partyTypeOptions, prContract.contract.owner.party_type)}
                </div>
              </div>

              <div className="flex items-center mt-2">
                <div className="text-sm text-gray-700">قرارداد ضمانتی:</div>
                <div
                  className={cn(
                    'mr-2',
                    prContract.is_guaranteed ? 'text-green-700' : 'text-red-700'
                  )}
                >
                  {prContract.is_guaranteed ? 'است' : 'نیست'}
                </div>
              </div>
            </div>

            <div className="mr-auto">
              <PRCStatus state={prContract.state} status={prContract.contract?.status} />
            </div>
          </>
        )}
      </LoadingAndRetry>
    </div>
  )
}

export default PRContractInfo
