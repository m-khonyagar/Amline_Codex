import { useEffect, useState } from 'react'
import { useCountdown } from '@/hooks/use-countdown'
import { handleErrorOnSubmit } from '@/utils/error'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { useAuthContext } from '..'
import { useConfirmCode, useOTPLogin, useOTPLoginVoip } from '@/data/api/auth'
import Button from '@/components/ui/Button'
import InputOTP from '@/components/ui/InputOTP'

const OTP_LENGTH = 5

function AuthSimpleLogin() {
  const timer = useCountdown(120, { startOnMount: false })
  const { setToken, setIsLoggedIn } = useAuthContext()
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [activeStep, setActiveStep] = useState('mobile')

  const methods = useForm({ mobile: '' })

  const otpLoginMutation = useOTPLogin()
  const otpLoginMutationVoip = useOTPLoginVoip()
  const confirmCodeMutation = useConfirmCode()

  const handleMobileStep = ({ mobile: newMobile }) => {
    if (mobile !== newMobile || otpLoginMutation.isError) {
      setMobile(newMobile)

      const _data = { mobile: `0${newMobile}`.slice(-11) }
      otpLoginMutation.mutate(_data, {
        onSuccess: () => {
          timer.reset()
          setActiveStep('verification')
        },
        onError: (e) => {
          handleErrorOnSubmit(e)
        },
      })
    } else {
      setActiveStep('verification')
    }
  }

  const handleVerificationStep = (_code) => {
    const params = { mobile: `0${mobile}`.slice(-11), otp: _code || code }

    confirmCodeMutation.mutate(params, {
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
      }
    )
  }
  const handleResendCodeVoip = () => {
    otpLoginMutationVoip.mutate(
      { mobile: `0${mobile}`.slice(-11) },
      {
        onSuccess: () => {
          timer.reset()
          confirmCodeMutation.reset()
        },
      }
    )
  }

  // If `mobile` is provided as a query param, run the mobile step and remove the param
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const mobileParam = params.get('mobile')

      if (!mobileParam) return

      // If the form supports setValue, set the input so UI reflects the param
      if (methods && typeof methods.setValue === 'function') {
        methods.setValue('mobile', mobileParam)
      }

      // Trigger the same handler used by the form submit
      handleMobileStep({ mobile: mobileParam })

      // Remove the mobile param from the URL without reloading
      params.delete('mobile')
      const newSearch = params.toString()
      const newUrl =
        window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash
      window.history.replaceState(null, '', newUrl)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error handling mobile query param', e)
    }
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="flex flex-col gap-4">
      {activeStep === 'mobile' && (
        <Form methods={methods} onSubmit={handleMobileStep}>
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

          <Button type="submit" loading={otpLoginMutation.isPending} className="w-full">
            ورود
          </Button>
        </Form>
      )}

      {activeStep === 'verification' && (
        <>
          <h1 className="mt-4 mb-0 text-center">کد تایید</h1>

          <InputOTP
            value={code}
            className="mt-5"
            type="number"
            length={OTP_LENGTH}
            onChange={(c) => setCode(c)}
            disabled={confirmCodeMutation.isPending}
            onComplete={(c) => handleVerificationStep(c)}
          />

          <div className="w-full mt-5 fa">کد ارسال شده به شماره {mobile} را وارد کنید</div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              className="text-blue-600 py-2"
              onClick={() => setActiveStep('mobile')}
            >
              اصلاح شماره
            </button>

            <div className="fa flex justify-center">
              {timer.timeLeft.total > 0 ? (
                <div className="flex items-center text-gray-300 text-sm py-2">
                  <span className="min-w-[2.5rem] text-center">
                    {timer.timeLeft.minutes}:{timer.timeLeft.seconds}
                  </span>
                  تا ارسال مجدد
                </div>
              ) : (
                <>
                  <Button variant="subtle" onClick={handleResendCode}>
                    ارسال مجدد
                  </Button>
                  <Button variant="subtle" onClick={handleResendCodeVoip}>
                    ارسال از طریق تماس
                  </Button>
                </>
              )}
            </div>
          </div>

          <Button
            type="submit"
            onClick={() => handleVerificationStep(code)}
            className="mt-8 w-full"
            loading={confirmCodeMutation.isPending}
            disabled={code.length !== OTP_LENGTH}
          >
            ورود
          </Button>
        </>
      )}
    </div>
  )
}

export default AuthSimpleLogin
