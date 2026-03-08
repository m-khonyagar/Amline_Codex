import { useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import { TaskForm } from '../components/task'

function TaskUpdatePage() {
  const { id } = useParams()

  return (
    <Page title="ویرایش وظیفه">
      <TaskForm id={id} />
    </Page>
  )
}

export default TaskUpdatePage
