import Image from 'next/image'
import { useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import InputOTP from '@/components/ui/InputOTP'
import shieldPasswordImg from '@/assets/images/shield_password.svg'

const OTP_LENGTH = 5

function AuthFormVerificationStep({
  mobile,
  onNext,
  onBack,
  isLoading,
  timeLeft,
  onResend,
  onResendVoip,
}) {
  const confirmBtnRef = useRef()
  const [code, setCode] = useState('')

  const handleNext = (_code) => {
    onNext({ code: _code || code })

    setTimeout(() => {
      confirmBtnRef.current.focus()
    }, 0)
  }
  return (
    <div className="pt-2">
      <Image
        width={103}
        height={113}
        alt="confirm"
        className="mx-auto"
        src={shieldPasswordImg.src}
      />

      <h1 className="mt-4 mb-0 text-center">کد تایید</h1>

      <InputOTP
        value={code}
        className="mt-5"
        type="number"
        length={OTP_LENGTH}
        onChange={(c) => setCode(c)}
        disabled={isLoading}
        onComplete={(c) => handleNext(c)}
      />

      <div className="w-full mt-5 fa">کد ارسال شده به شماره {mobile} را وارد کنید</div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" className="text-blue-600 py-2" onClick={() => onBack()}>
          اصلاح شماره
        </button>

        <div className="fa flex justify-center">
          {timeLeft.total > 0 ? (
            <div className="flex items-center text-gray-300 text-sm py-2">
              <span className="min-w-[2.5rem] text-center">
                {timeLeft.minutes}:{timeLeft.seconds}
              </span>
              تا ارسال مجدد
            </div>
          ) : (
            <>
              <Button variant="subtle" onClick={() => onResend()}>
                ارسال مجدد پیامک
              </Button>
              <Button variant="subtle" onClick={() => onResendVoip()}>
                ارسال از طریق تماس
              </Button>
            </>
          )}
        </div>
      </div>

      <Button
        type="submit"
        ref={confirmBtnRef}
        onClick={() => handleNext()}
        className="mt-8 w-full"
        loading={isLoading}
        disabled={code.length !== OTP_LENGTH}
      >
        ورود
      </Button>
    </div>
  )
}

export default AuthFormVerificationStep
