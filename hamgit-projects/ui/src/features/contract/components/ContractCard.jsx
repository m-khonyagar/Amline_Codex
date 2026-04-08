import { useMemo } from 'react'
import Image from 'next/image'
import { format } from 'date-fns-jalali'
import Link from 'next/link'
import contractsIcon from '@/assets/images/contracts_icon.svg'
import { cn, fullName } from '@/utils/dom'
import { contractStatusEnum } from '@/features/contract'
import { getPrContractProcesses } from '../libs/contract-process'
import {
  CircleBigCheckIcon,
  CircleCloseIcon,
  CircleLoadingIcon,
  ClockIcon,
  DownloadIcon,
} from '@/components/icons'
import Button from '@/components/ui/Button'
// import copyImg from '@/assets/images/copy.svg'

function ContractCard({ contract }) {
  const parties = contract.parties.filter((party) => party?.first_name)
  const lastProcess = useMemo(() => {
    if (!contract.steps) return {}

    if (contract.steps?.TRACKING_CODE_DELIVERED) {
      return {
        date: contract.steps.TRACKING_CODE_DELIVERED,
        link: null,
        error: false,
        status: 'قرارداد نهایی شده',
        completed: true,
        finalized: true,
        label: 'صدور کد رهگیری و مشاهده قرارداد',
      }
    }

    const processes = getPrContractProcesses({
      contractId: contract?.id,
      contractType: contract.type,
      statuses: contract,
    })

    return processes.reverse().find((p) => p.status !== '') || {}
  }, [contract])

  // const { isCopied, copy } = useCopy()

  return (
    <div className="bg-background rounded-2xl shadow-md fa">
      <Link href={`/contracts/${contract.id}`} className="flex gap-4 p-5">
        <div className="relative">
          <Image src={contractsIcon.src} width={45} height={45} alt="contractsIcon" />
          {contract.status === contractStatusEnum.DRAFT && (
            <div className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full bg-yellow-600" />
          )}
        </div>

        <div className="flex flex-col justify-around">
          <div className="text-sm">
            اجاره نامه{' '}
            {(() => {
              const { landlord, tenant } = parties.reduce(
                (acc, party) => {
                  if (party.party_type === 'LANDLORD') acc.landlord = party
                  if (party.party_type === 'TENANT') acc.tenant = party
                  return acc
                },
                { landlord: null, tenant: null }
              )
              return `${fullName(landlord)} با ${fullName(tenant)}`
            })()}
          </div>

          {contract.created_at && (
            <div className="flex gap-1 items-center text-gray-500">
              <ClockIcon size={16} className="mb-0.5" />
              <div className="text-sm">
                {format(new Date(contract.created_at), 'yyyy/MM/dd - HH:MM')}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* <div className="px-5 mb-1">
        <div className="fa text-sm flex items-center mb-2">
          <span className="ml-auto">شناسه قرارداد:</span>
          <button type="button" onClick={() => copy(contract.id)} className="flex gap-1">
            {contract.id}
            <Image alt="copy" width={14} height={16} src={copyImg.src} />
          </button>
        </div>
        <div className="fa text-sm flex gap-1 items-center">
          <span className="ml-auto">رمز:</span>
          <button type="button" onClick={() => copy(contract.password)} className="flex gap-1">
            {contract.password}
            <Image alt="copy" width={14} height={16} src={copyImg.src} />
          </button>
        </div>
      </div> */}

      <hr />

      <div className="flex justify-between p-5">
        <div
          className={cn({
            'text-primary': !lastProcess.finalized && lastProcess.completed,
            'text-green-600': lastProcess.finalized && lastProcess.completed,
            'text-red-600': lastProcess.error,
            'text-yellow-600': !lastProcess.completed && !lastProcess.error,
          })}
        >
          <div className="flex gap-2 items-center">
            {/* eslint-disable-next-line no-nested-ternary */}
            {lastProcess.completed ? (
              <CircleBigCheckIcon size={20} />
            ) : lastProcess.error ? (
              <CircleCloseIcon size={20} />
            ) : (
              <CircleLoadingIcon size={20} />
            )}
            <p className="text-sm">{lastProcess.status} </p>
          </div>
        </div>

        {contract.status === contractStatusEnum.PDF_GENERATED && (
          <Button
            size="sm"
            variant="link"
            href={`/contracts/${contract.id}/payment-history`}
            className="h-auto flex items-center justify-center gap-2"
          >
            <p>فایل قرارداد</p>
            <DownloadIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

export default ContractCard
