import { useNavigate, useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import AdCreation from '../components/AdCreation'

const AdCreationPage = () => {
  const { id: adId } = useParams()
  const navigate = useNavigate()

  return (
    <Page title={adId ? `ویرایش آگهی ${adId}` : 'ایجاد آگهی'}>
      <div className="max-w-7xl w-full">
        <AdCreation
          adId={adId}
          onCancel={adId ? () => navigate(-1) : null}
          onSuccess={(id) => navigate(`/ads/list/${id}`, { replace: true })}
        />
      </div>
    </Page>
  )
}

export default AdCreationPage
