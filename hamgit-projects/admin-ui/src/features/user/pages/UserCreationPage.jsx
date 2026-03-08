import { useNavigate, useParams } from 'react-router-dom'
import UserCreation from '../components/UserCreation'
import { Page } from '@/features/misc'

const UserCreationPage = () => {
  const { id: userId } = useParams()
  const navigate = useNavigate()

  return (
    <Page title={userId ? `ویرایش کاربر ${userId}` : 'ایجاد کاربر'}>
      <div className="md:max-w-5xl">
        <UserCreation
          key={userId}
          userId={userId}
          onCancel={userId ? () => navigate(`/users/${userId}`) : null}
          onSuccess={(res) => navigate(`/users/${res.id}`, { replace: true })}
        />
      </div>
    </Page>
  )
}

export default UserCreationPage
