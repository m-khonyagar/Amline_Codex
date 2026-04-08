import { useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import RequirementInfo from '../components/RequirementInfo'

const RequirementViewPage = () => {
  const { id: requirementId } = useParams()

  return (
    <Page title="اطلاعات نیازمندی">
      <RequirementInfo requirementId={requirementId} />
    </Page>
  )
}

export default RequirementViewPage
