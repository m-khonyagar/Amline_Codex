import { useParams } from 'react-router-dom'
import PRContractViewPDF from '../components/PRContractViewPDF/PRContractViewPDF'

const PRContractViewPDFPage = () => {
  const { id: contractId } = useParams()

  return (
    <div>
      <PRContractViewPDF contractId={contractId} />
    </div>
  )
}

export default PRContractViewPDFPage
