import { useParams } from 'react-router-dom'
import PRContractProperty from '../components/PRContractProperty/PRContractProperty'

const PRContractViewPropertyPage = () => {
  const { id: contractId } = useParams()

  return (
    <div>
      <PRContractProperty contractId={contractId} />
    </div>
  )
}

export default PRContractViewPropertyPage
