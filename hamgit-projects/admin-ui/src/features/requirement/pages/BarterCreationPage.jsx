import { useNavigate, useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import BarterCreation from '../components/BarterCreation'

const BarterCreationPage = () => {
  const { id: barterId } = useParams()
  const navigate = useNavigate()

  return (
    <Page title={barterId ? `ویرایش معاوضه ${barterId}` : 'ایجاد معاوضه'}>
      <div className="max-w-5xl w-full">
        <BarterCreation
          barterId={barterId}
          onCancel={barterId ? () => navigate(-1) : null}
          onSuccess={(id) => navigate(`/requirements/barter/${id}`, { replace: true })}
        />
      </div>
    </Page>
  )
}

export default BarterCreationPage
