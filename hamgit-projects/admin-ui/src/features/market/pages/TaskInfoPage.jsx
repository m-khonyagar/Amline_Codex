import { useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import { TaskInfo } from '../components/task'

function TaskInfoPage() {
  const { id } = useParams()

  return (
    <Page title="جزئیات وظیفه">
      <TaskInfo id={id} />
    </Page>
  )
}

export default TaskInfoPage
