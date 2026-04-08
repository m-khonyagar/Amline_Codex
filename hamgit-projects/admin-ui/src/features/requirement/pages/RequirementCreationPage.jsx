import { useNavigate, useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import RequirementCreation from '../components/RequirementCreation'

const RequirementCreationPage = () => {
  const { id: requirementId } = useParams()
  const navigate = useNavigate()

  return (
    <Page title={requirementId ? `ویرایش نیازمندی ${requirementId}` : 'ایجاد نیازمندی'}>
      <div className="max-w-5xl w-full">
        <RequirementCreation
          requirementId={requirementId}
          onCancel={requirementId ? () => navigate(-1) : null}
          onSuccess={(id) => navigate(`/requirements/buy-and-rental/${id}`, { replace: true })}
        />
      </div>
    </Page>
  )
}

export default RequirementCreationPage
