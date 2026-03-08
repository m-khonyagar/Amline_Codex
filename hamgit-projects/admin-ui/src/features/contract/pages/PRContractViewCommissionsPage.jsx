import { useParams } from 'react-router-dom'
import PRContractCommissions from '../components/PRContractCommissions/PRContractCommissions'

const PRContractViewCommissionsPage = () => {
  const { id: contractId } = useParams()

  return (
    <div>
      <PRContractCommissions contractId={contractId} />
    </div>
  )
}

export default PRContractViewCommissionsPage
