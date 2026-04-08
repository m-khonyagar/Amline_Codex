import { useParams } from 'react-router-dom'
import PRContractParties from '../components/PRContractParties/PRContractParties'

const PRContractViewPartiesPage = () => {
  const { id: contractId } = useParams()

  return (
    <div>
      <PRContractParties contractId={contractId} />
    </div>
  )
}

export default PRContractViewPartiesPage
