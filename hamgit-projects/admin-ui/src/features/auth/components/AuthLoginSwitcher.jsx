import Button from '@/components/ui/Button'

function AuthLoginSwitcher({ useOtpLogin: [isOtpLogin, setIsOtpLogin] }) {
  const toggleLoginMethod = () => {
    setIsOtpLogin((prev) => !prev)
  }

  return (
    <div className="mt-4  flex flex-row items-center justify-center">
      {isOtpLogin ? ' میخواهید با رمز عبور وارد شوید؟' : ' ورود با کد یکبار مصرف؟'}
      <Button onClick={toggleLoginMethod} variant="link">
        {isOtpLogin ? 'ورود با رمز عبور' : 'ورود با OTP'}
      </Button>
    </div>
  )
}

export default AuthLoginSwitcher
