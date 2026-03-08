import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Scanner } from '@yudiel/react-qr-scanner'
import { toast } from '@/components/ui/Toaster'
import { HeaderNavigation } from '@/features/app'
import useBack from '@/hooks/use-back'
import publicRuntimeConfig from '@/configs/public-runtime-config.mjs'

export default function ScanInquiryContractPage() {
  const router = useRouter()
  const { goBack } = useBack()
  const backUrl = '/contracts/inquiry/'
  const { BASE_URL } = publicRuntimeConfig

  function handleSubmit(result) {
    const target = result.length ? result[0]?.rawValue : ''

    if (target && target.startsWith(BASE_URL)) {
      router.replace(target)
    } else {
      toast.error('بارکد صحیح نیست')
      goBack(backUrl)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toast.error('بارکدی یافت نشد!')
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <HeaderNavigation title="استعلام قرارداد" />
      <div className="flex-grow flex flex-col items-center justify-center bg-black relative -mb-8">
        <Scanner
          onScan={(result) => handleSubmit(result)}
          classNames={{
            container: 'scanner-container',
            video: '',
          }}
          styles={{
            container: {},
            video: {},
            finderBorder: 35,
          }}
        />
      </div>
    </>
  )
}
