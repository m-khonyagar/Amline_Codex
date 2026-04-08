import Button from '@/components/ui/Button'
import useLoginAsUser from '../api/login-as-user'
import { LogoutIcon } from '@/components/icons'

const LoginAsUser = ({ userId, className }) => {
  const loginAsUserMutation = useLoginAsUser()

  const loginAsUser = () => {
    loginAsUserMutation.mutate(userId, {
      onSuccess: (res) => {
        const link = `${import.meta.env.VITE_USER_CLIENT_APP_URL}/auth?tk=${res.data.access_token}`
        window.open(link, '_blank')
      },
    })
  }

  return (
    <Button
      size="sm"
      className={className}
      loading={loginAsUserMutation.isPending}
      onClick={() => loginAsUser()}
    >
      <LogoutIcon size={16} className="ml-2" />
      ورود به پنل کاربر
    </Button>
  )
}

export default LoginAsUser
