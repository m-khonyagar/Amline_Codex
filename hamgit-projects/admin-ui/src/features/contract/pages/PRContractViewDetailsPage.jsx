import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PRContractStatus from '../components/PRContractStatus/PRContractStatus'
import PRContractDetails from '../components/PRContractDetails/PRContractDetails'
import PRContractTrackingCode from '../components/PRContractTrackingCode/PRContractTrackingCode'
import PRContractDescriptions from '../components/PRContractDescriptions'

const PRContractViewDetailsPage = () => {
  const { id: contractId } = useParams()
  const [isOnDetailsEditMode, setIsOnDetailsEditMode] = useState(false)

  return (
    <div>
      <PRContractDetails contractId={contractId} onEditModeChange={setIsOnDetailsEditMode} />

      {!isOnDetailsEditMode && (
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex-grow basis-full md:basis-1/3">
            <PRContractTrackingCode contractId={contractId} />
            <PRContractDescriptions contractId={contractId} />
          </div>

          <PRContractStatus contractId={contractId} className="flex-grow basis-full md:basis-1/3" />
        </div>
      )}
    </div>
  )
}

export default PRContractViewDetailsPage
