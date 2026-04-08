import PRContractParty from './PRContractParty'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { partyType } from '@/data/enums/prcontract-enums'
import { useGetPRContractParties } from '../../api/get-pr-contract-parties'

const PRContractParties = ({ contractId }) => {
  const prContractPartiesQuery = useGetPRContractParties(contractId)

  const parties = prContractPartiesQuery.data

  return (
    <div>
      <LoadingAndRetry query={prContractPartiesQuery} checkRefetching>
        {parties && (
          <div className="flex flex-wrap gap-4">
            <PRContractParty
              className="flex-grow xl:basis-1/3"
              contractId={contractId}
              party={parties.landlord}
              partyType={partyType.LANDLORD}
            />

            <PRContractParty
              className="flex-grow xl:basis-1/3"
              contractId={contractId}
              party={parties.tenant}
              partyType={partyType.TENANT}
            />
          </div>
        )}
      </LoadingAndRetry>
    </div>
  )
}

export default PRContractParties
