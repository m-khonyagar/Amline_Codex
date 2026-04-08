import { useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import BarterInfo from '../components/BarterInfo'

const BarterViewPage = () => {
  const { id: barterId } = useParams()

  return (
    <Page title="اطلاعات معاوضه">
      <BarterInfo barterId={barterId} />
    </Page>
  )
}

export default BarterViewPage
