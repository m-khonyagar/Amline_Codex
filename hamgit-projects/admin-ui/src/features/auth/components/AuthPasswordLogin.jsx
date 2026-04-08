import { handleErrorOnSubmit } from '@/utils/error'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { useAuthContext } from '..'
import useAdminLogin from '../api/login'
import Button from '@/components/ui/Button'

const defaultValues = {
  mobile: '',
  password: '',
}

function AuthPasswordLogin() {
  const { setToken, setIsLoggedIn } = useAuthContext()
  const loginMutation = useAdminLogin()

  const methods = useForm({ defaultValues })

  const handleSubmit = (data) => {
    loginMutation.mutate(
      {
        mobile: `0${data.mobile}`.slice(-11),
        national_code: data.password,
      },
      {
        onSuccess: (res) => {
          setToken({
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
          })

          setIsLoggedIn(true)
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      }
    )
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        ltr
        required
        isNumeric
        type="tel"
        name="mobile"
        label="شماره همراه"
        placeholder="شماره همراه"
        suffix={<span dir="ltr">+98</span>}
      />

      <InputField
        ltr
        required
        type="password"
        name="password"
        label="رمز عبور"
        placeholder="رمز عبور"
      />

      <Button type="submit" loading={loginMutation.isPending}>
        ورود
      </Button>
    </Form>
  )
}

export default AuthPasswordLogin
