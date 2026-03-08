/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import shieldPasswordImg from '@/assets/images/shield_password.svg'
import InputOTP from '@/components/ui/InputOTP'
import Button from '@/components/ui/Button'
import { BottomCTA } from '@/features/app'
import { useCountdown } from '@/hooks/use-countdown'
import { useAuthContext } from '@/features/auth'
import useSignContract from '../../api/sign-contract'
import useVerifyCode from '../../api/verify-sign'
import { handleErrorOnSubmit } from '@/utils/error'
import useContractLogic from '../../hooks/use-contract-logic'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import useGetContractStatus from '../../api/get-contract-status'
import useSignContractVoip from '../../api/sign-contract-voip'

const OTP_LENGTH = 5

function Signature() {
  const confirmBtnRef = useRef()
  const { currentUser } = useAuthContext()
  const timer = useCountdown(120, { startOnMount: false })
  const router = useRouter()
  const { contractId } = router.query
  const signContract = useSignContract(contractId)
  const signContractVoip = useSignContractVoip(contractId)
  const verificationSign = useVerifyCode(contractId)
  const contractStatusQuery = useGetContractStatus(contractId, { enabled: router.isReady })
  const { data: statuses } = contractStatusQuery

  const [code, setCode] = useState('')
  const { signedByCurrentUser } = useContractLogic(statuses)

  const handleNext = (_code) => {
    setTimeout(() => {
      confirmBtnRef.current.focus()
    }, 0)

    verificationSign.mutate(
      {
        otp: _code || code,
      },
      {
        onSuccess: () => {
          router.push(`/contracts/${contractId}/manage/sign/success-sign`)
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }
  const sendCode = () => {
    signContract.mutate(null, {
      onSuccess: () => {
        timer.reset()
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }
  const sendCodeVoip = () => {
    signContractVoip.mutate(null, {
      onSuccess: () => {
        timer.reset()
      },
      onError: (err) => {
        handleErrorOnSubmit(err)
      },
    })
  }
  const handleResendCode = () => {
    sendCode()
  }
  const handleResendCodeVoip = () => {
    sendCodeVoip()
  }

  useEffect(() => {
    if (contractStatusQuery.data && signedByCurrentUser !== undefined && !signedByCurrentUser) {
      sendCode()
    }
  }, [contractStatusQuery.data, signedByCurrentUser])

  return (
    <div className="mx-6 mt-40">
      <div className="pt-2">
        <Image
          width={103}
          height={113}
          alt="confirm"
          className="mx-auto mb-4"
          src={shieldPasswordImg.src}
        />

        <LoadingAndRetry query={contractStatusQuery}>
          {signedByCurrentUser ? (
            <>
              <div className="text-center text-teal-600">شما قرارداد را امضا کرده اید</div>

              <BottomCTA>
                <Button className="w-full" href={`/contracts/${contractId}`}>
                  مشاهده روند قرارداد
                </Button>
              </BottomCTA>
            </>
          ) : (
            <>
              <h1 className="mb-0 text-center">کد امضا: </h1>

              <InputOTP
                value={code}
                className="mt-5"
                length={OTP_LENGTH}
                onChange={(c) => setCode(c)}
                onComplete={(c) => handleNext(c)}
              />

              <div className="w-full mt-5 fa">
                کد امضای ارسال شده به شماره {currentUser?.mobile} را وارد کنید
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="fa flex justify-center">
                  {timer.timeLeft.total > 0 ? (
                    <div className="flex items-center text-gray-300 text-sm py-2">
                      <span className="min-w-[2.5rem] text-center">
                        {timer.timeLeft.minutes}:{timer.timeLeft.seconds}
                      </span>
                      تا درخواست مجدد کد
                    </div>
                  ) : (
                    <>
                      <Button variant="subtle" onClick={handleResendCode}>
                        درخواست مجدد کد
                      </Button>
                      <Button variant="subtle" onClick={handleResendCodeVoip}>
                        ارسال از طریق تماس
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <BottomCTA>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Button
                    type="submit"
                    ref={confirmBtnRef}
                    onClick={() => handleNext()}
                    loading={verificationSign.isPending}
                    disabled={code.length !== OTP_LENGTH}
                  >
                    تایید نهایی
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={verificationSign.isPending}
                  >
                    انصراف
                  </Button>
                </div>
              </BottomCTA>
            </>
          )}
        </LoadingAndRetry>
      </div>
    </div>
  )
}

export default Signature
