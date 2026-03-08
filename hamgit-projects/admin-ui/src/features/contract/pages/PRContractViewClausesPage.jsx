import { useParams } from 'react-router-dom'
import PRContractClauses from '../components/PRContractClauses/PRContractClauses'

const PRContractViewClausesPage = () => {
  const { id: contractId } = useParams()

  return (
    <div>
      <PRContractClauses contractId={contractId} />
    </div>
  )
}

export default PRContractViewClausesPage
