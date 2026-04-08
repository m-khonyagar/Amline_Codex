import { useMemo, useState, useRef } from 'react'
import { useGetFile } from '@/features/misc'
import { handleErrorOnSubmit } from '@/utils/error'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetPRContractInfo } from '../../api/get-pr-contract-info'
import useGenerateContractPdf from '../../api/generate-contract-pdf'
import useUploadCustomPdf from '../../api/upload-custom-pdf'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { CircleLoadingIcon, PencilIcon, PlusIcon } from '@/components/icons'

const PRContractViewPDF = ({ contractId }) => {
  const [isOpenActions, setIsOpenActions] = useState(false)
  const fileInputRef = useRef(null)

  const prContractQuery = useGetPRContractInfo(contractId)

  const pdfId = prContractQuery.data?.contract?.pdf_file?.id

  const downloadQuery = useGetFile(pdfId)

  const generateMutation = useGenerateContractPdf(contractId)
  const uploadCustomPdfMutation = useUploadCustomPdf(contractId)

  const file = useMemo(() => {
    if (!downloadQuery.data) return

    const file = new Blob([downloadQuery.data], { type: 'application/pdf' })

    return URL.createObjectURL(file)
  }, [downloadQuery.data])

  const handleGenerate = (e) => {
    e.preventDefault()

    generateMutation.mutate(contractId, {
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
      onSettled: () => {
        toggleIsOpenActions(false)
      },
    })
  }

  const toggleIsOpenActions = (s) => {
    if (generateMutation.isPending || uploadCustomPdfMutation.isPending) {
      return
    }

    setIsOpenActions(s)
  }

  const handleUploadClick = (e) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      handleErrorOnSubmit(new Error('فقط فایل PDF قابل آپلود است'))
      e.target.value = ''
      return
    }

    uploadCustomPdfMutation.mutate(
      { file, signal: null },
      {
        onSuccess: () => {
          toggleIsOpenActions(false)
          e.target.value = ''
        },
        onError: () => {
          e.target.value = ''
        },
      }
    )
  }
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div className="mb-4">
        <DropdownMenu open={isOpenActions} onOpenChange={(s) => toggleIsOpenActions(s)}>
          <DropdownMenuTrigger asChild>
            <button className="mr-auto text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2">
              <PencilIcon size={16} />
              عملیات
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            <DropdownMenuItem
              disabled={generateMutation.isPending || uploadCustomPdfMutation.isPending}
              onClick={(e) => handleGenerate(e)}
            >
              {generateMutation.isPending ? (
                <CircleLoadingIcon size={16} className="animate-spin" />
              ) : (
                <PlusIcon size={16} />
              )}
              {file ? 'ایحاد مجدد فایل قرارداد' : 'ایحاد فایل قرارداد'}
            </DropdownMenuItem>

            <DropdownMenuItem
              disabled={generateMutation.isPending || uploadCustomPdfMutation.isPending}
              onClick={(e) => handleUploadClick(e)}
            >
              {uploadCustomPdfMutation.isPending ? (
                <CircleLoadingIcon size={16} className="animate-spin" />
              ) : (
                <PlusIcon size={16} />
              )}
              آپلود فایل دلخواه
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <LoadingAndRetry query={[prContractQuery, pdfId ? downloadQuery : null].filter(Boolean)}>
        <div className="max-w-4xl mx-auto py-4">
          {file && (
            <iframe
              src={file}
              width="100%"
              height="800px"
              type="application/pdf"
              title={'contract'}
            />
          )}

          {!file && (
            <div className="p-4 bg-teal-100 text-teal-800 rounded-lg text-center">
              فایل قرارداد ایجاد نشده است
            </div>
          )}
        </div>
      </LoadingAndRetry>
    </>
  )
}

export default PRContractViewPDF
