import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { BottomCTA, HeaderNavigation } from '@/features/app'
import inquiry from '@/assets/images/inquiry.svg'
import { Form, InputField, useForm } from '@/components/ui/Form'
import { handleErrorOnSubmit } from '@/utils/error'
import Button from '@/components/ui/Button'
import { useGetContractInquiry } from '../../api/get-contracts-inquire'
import QrScannerIcon from '@/components/icons/QrScannerIcon'
import { isWebView } from '@/utils/webview'

const defaultValues = {
  key: '',
  password: '',
}

export default function InquiryContractPage() {
  const router = useRouter()

  const methods = useForm({
    defaultValues,
  })

  const [key, setKey] = useState('')
  const [password, setPassword] = useState('')
  const getContractInquiryMutation = useGetContractInquiry(key, password)

  const onSubmit = (data) => {
    setKey(data.key)
    setPassword(data.password)

    getContractInquiryMutation.mutate(
      {},
      {
        onSuccess: () => {
          router.push(`/contracts/inquiry/${data.key}/${data.password}`)
        },
        onError: (err) => {
          handleErrorOnSubmit(err)
        },
      }
    )
  }

  const [hasMediaDevices, setHasMediaDevices] = useState(false)

  useEffect(() => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      setHasMediaDevices(true)
    }
  }, [])

  return (
    <>
      <HeaderNavigation title="استعلام قرارداد" href="/" />

      <div className="mt-16 px-6">
        <Image
          className="mx-auto mb-[48px]"
          width={138}
          height={162}
          src={inquiry.src}
          alt="استعلام قرارداد"
        />

        <h1 className="font-semibold text-lg text-center mb-1">استعلام قرارداد</h1>
        <p className="text-center text-[12px] text-[#878787] mb-6">
          از اینجا می تونی اصالت قراردادت رو استعلام بگیری
        </p>

        <Form methods={methods} onSubmit={onSubmit} className="mb-3">
          <InputField required name="key" label="شماره قرارداد" placeholder="وارد کنید" isNumeric />

          <InputField required name="password" label="رمز قرارداد" placeholder="وارد کنید" />

          <BottomCTA>
            <Button className="w-full" type="submit" loading={getContractInquiryMutation.isPending}>
              استعلام
            </Button>
          </BottomCTA>
        </Form>

        {hasMediaDevices && !isWebView() && (
          <div className="flex justify-center">
            <Link
              href="/contracts/inquiry/scan"
              className="flex border border-gray-200 items-center px-2.5 py-1.5 rounded-lg"
            >
              <QrScannerIcon className="text-primary ml-1.5" size={20} />
              <span>اسکن کنید</span>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
