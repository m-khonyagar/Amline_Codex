import { useParams } from 'react-router-dom'
import PRContractPayments from '../components/PRContractPayments/PRContractPayments'

const PRContractViewPaymentsPage = () => {
  const { id: contractId } = useParams()

  return <PRContractPayments contractId={contractId} />
}

export default PRContractViewPaymentsPage
