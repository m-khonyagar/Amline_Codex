import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { saveAs } from 'file-saver'
import { HeaderNavigation } from '@/features/app'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import copyImg from '@/assets/images/copy.svg'
import Button from '@/components/ui/Button'
import { DownloadIcon } from '@/components/icons'
import { toast } from '@/components/ui/Toaster'
import { useDownloadFile } from '@/features/common'
import { contractStatusEnum, useGetContractPayments } from '@/features/contract'
import useExportContract from '../api/export-contract'
import PaymentCard from '../components/payment/PaymentCard'
import useGetContract from '../api/get-contract'
import { downloadBlobFile, isWebView } from '@/utils/webview'
import { useCopy } from '@/hooks/use-copy'

function PaymentHistory() {
  const router = useRouter()
  const { contractId } = router.query

  const contractPaymentsQuery = useGetContractPayments(contractId, { enabled: router.isReady })

  const contractQuery = useGetContract(contractId, { enabled: router.isReady })

  const exportContractMutation = useExportContract(contractId)
  const downloadFileMutation = useDownloadFile()

  const payments = useMemo(() => contractPaymentsQuery.data || [], [contractPaymentsQuery.data])
  const trackingCode = useMemo(() => contractQuery.data?.tracking_code?.value, [contractQuery.data])

  const handleSaveFile = (file) => {
    if (!file?.id) {
      toast.error('فایل قرارداد یافت نشد، لطفا با پشتیبانی تماس بگیرید')
      return
    }

    downloadFileMutation.mutate(file.id, {
      onSuccess: (res) => {
        if (isWebView()) {
          downloadBlobFile(res, `contract-${contractId}.pdf`)
        } else {
          saveAs(new Blob([res]), `contract-${contractId}.pdf`)
        }
      },
    })
  }

  const handleExport = () => {
    if (!contractId) return

    const file = contractQuery?.data?.contract?.pdf_file

    if (file) {
      handleSaveFile(file)
    }

    // if (exportContractMutation.isSuccess && downloadFileMutation.isError) {
    //   handleSaveFile(exportContractMutation.data)
    // }
    //
    // exportContractMutation.mutate(
    //   {},
    //   {
    //     onSuccess: (res) => {
    //       handleSaveFile(res.data)
    //     },
    //     onError: (err) => {
    //       handleErrorOnSubmit(err)
    //     },
    //   }
    // )
  }

  const { isCopied, copy } = useCopy()
  useEffect(() => {
    if (isCopied) {
      toast.success('کپی شد')
    }
  }, [isCopied])

  return (
    <>
      <HeaderNavigation title="پرداخت" />

      <div className="mt-6 px-6">
        <LoadingAndRetry query={[contractQuery, contractPaymentsQuery]}>
          {contractQuery.data && (
            <>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 fa"
                  disabled={!trackingCode}
                  onClick={() => copy(trackingCode)}
                >
                  <Image alt="copy" width={14} height={17} src={copyImg.src} />
                  کد رهگیری:
                  <span className="text-sm">{trackingCode || '- - - - - -'}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="mr-auto gap-1"
                  disabled={
                    !router.isReady ||
                    contractQuery?.data?.contract?.status !== contractStatusEnum.PDF_GENERATED
                  }
                  onClick={() => handleExport()}
                  loading={exportContractMutation.isPending || downloadFileMutation.isPending}
                >
                  فایل قرارداد <DownloadIcon size={20} />
                </Button>
              </div>
              <div className="fa text-sm flex gap-3 justify-center flex-wrap">
                <button
                  type="button"
                  className="flex gap-1 items-center"
                  onClick={() => copy(contractId)}
                >
                  <Image
                    alt="copy"
                    width={11}
                    height={14}
                    src={copyImg.src}
                    className="w-auto h-auto"
                  />
                  <span>شناسه قرارداد:</span>
                  {contractId}
                </button>
                <button
                  type="button"
                  className="flex gap-1 items-center"
                  onClick={() => copy(contractQuery.data?.password)}
                >
                  <Image
                    alt="copy"
                    width={11}
                    height={14}
                    src={copyImg.src}
                    className="w-auto h-auto"
                  />
                  <span>رمز:</span>
                  {contractQuery.data?.password}
                </button>
              </div>
            </>
          )}

          <div className="flex flex-col gap-4 mt-6">
            {payments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </div>
        </LoadingAndRetry>
      </div>
    </>
  )
}

export default PaymentHistory
