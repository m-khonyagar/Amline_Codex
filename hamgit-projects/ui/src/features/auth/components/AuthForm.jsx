import { useState } from 'react'
import AuthFormMobileStep from './AuthFormMobileStep'
import { useCountdown } from '@/hooks/use-countdown'
import AuthFormVerificationStep from './AuthFormVerificationStep'
import { useAuthContext } from '@/features/auth'
import useOTPLogin from '../api/otp-login'
import { handleErrorOnSubmit } from '@/utils/error'
import useConfirmCode from '../api/confirm-code'
import useOTPLoginVoip from '../api/otp-login-voip'

function AuthForm() {
  const timer = useCountdown(120, { startOnMount: false })
  const [mobile, setMobile] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const { setToken } = useAuthContext()
  const [activeStep, setActiveStep] = useState('mobile')

  const otpLoginMutation = useOTPLogin()
  const otpLoginVoipMutation = useOTPLoginVoip()
  const confirmCodeMutation = useConfirmCode()

  const handleMobileStep = ({ mobile: newMobile }, { setError }) => {
    if (mobile !== newMobile || otpLoginMutation.isError) {
      setMobile(newMobile)
      setAcceptedTerms(true)

      const _data = { mobile: `0${newMobile}`.slice(-11) }
      otpLoginMutation.mutate(_data, {
        onSuccess: () => {
          timer.reset()
          setActiveStep('verification')
        },
        onError: (e) => {
          handleErrorOnSubmit(e, setError, _data)
        },
      })
    } else {
      setActiveStep('verification')
    }
  }

  const handleVerificationStep = ({ code }) => {
    const params = { mobile: `0${mobile}`.slice(-11), otp: code }

    confirmCodeMutation.mutate(params, {
      onSuccess: (res) => {
        setToken({
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
        })
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleResendCode = () => {
    otpLoginMutation.mutate(
      { mobile: `0${mobile}`.slice(-11) },
      {
        onSuccess: () => {
          timer.reset()
          confirmCodeMutation.reset()
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      }
    )
  }

  const handleResendCodeVoip = () => {
    otpLoginVoipMutation.mutate(
      { mobile: `0${mobile}`.slice(-11) },
      {
        onSuccess: () => {
          timer.reset()
          confirmCodeMutation.reset()
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      }
    )
  }

  return (
    <div>
      <div className="mx-6 mt-24">
        {activeStep === 'mobile' && (
          <AuthFormMobileStep
            mobile={mobile}
            onNext={handleMobileStep}
            acceptedTerms={acceptedTerms}
            isLoading={otpLoginMutation.isPending}
          />
        )}

        {activeStep === 'verification' && (
          <AuthFormVerificationStep
            mobile={mobile}
            timeLeft={timer.timeLeft}
            onResend={handleResendCode}
            onResendVoip={handleResendCodeVoip}
            isResendLoading={otpLoginMutation.isPending}
            isVoipLoading={otpLoginVoipMutation.isPending}
            onNext={handleVerificationStep}
            onBack={() => setActiveStep('mobile')}
            isLoading={confirmCodeMutation.isPending}
          />
        )}

        {/* {sendVerificationMutation.isError && (
          <Alert color="yellow" className="mt-8">
            ارسال کد تایید با خطا مواجه شد، لطفا مجددا تلاش نمایید
          </Alert>
        )}

        {loginMutation.isError && (
          <Alert color="yellow" className="mt-8">
            {loginMutation.error?.response?.status === 400
              ? Object.values(loginMutation.error.response.data.details).flat(1)
              : ' ورود با خطا مواجه شد، لطفا مجددا تلاش نمایید'}
          </Alert>
        )} */}
      </div>
    </div>
  )
}

export default AuthForm
