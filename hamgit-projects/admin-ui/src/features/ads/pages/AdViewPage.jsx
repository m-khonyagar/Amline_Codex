import { useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import AdInfo from '../components/AdInfo'

const AdViewPage = () => {
  const { id: adId } = useParams()

  return (
    <Page title="اطلاعات آگهی">
      <AdInfo adId={adId} />
    </Page>
  )
}

export default AdViewPage
