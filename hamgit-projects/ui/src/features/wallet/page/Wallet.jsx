import Image from 'next/image'
import React, { useMemo } from 'react'
import { HeaderNavigation } from '@/features/app'
import { numberSeparator } from '@/utils/number'
import { CircleLoadingIcon, TomanIcon } from '@/components/icons'
import WalletHomeNavigation from '../components/WalletHomeNavigation'
import useGetWallet from '../api/get-wallet'
import { useAuthContext } from '@/features/auth'
import { fullName } from '@/utils/dom'

export default function Wallet() {
  const walletQuery = useGetWallet()
  const wallet = useMemo(() => walletQuery?.data?.data, [walletQuery?.data])
  const { currentUser } = useAuthContext()

  return (
    <>
      <HeaderNavigation title="کیف پول" />
      <div className="p-6">
        <div className="h-[180px] w-[360px] mx-auto max-w-full bg-gradient-to-r from-[#179A9C] to-[#194B4B] to-80% relative text-white fa overflow-hidden rounded-[13px] mb-6">
          <svg
            className="absolute -bottom-2.5 left-5"
            width="357"
            height="133"
            viewBox="0 0 357 133"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M353.443 4.5443C307.989 142.268 -170.607 -42.8441 72.3361 129.247"
              stroke="#0A3C3C"
              strokeDasharray="2 2"
            />
            <path
              d="M353.447 32.8171C300.51 142.833 -126.766 -12.1117 97.908 129.861"
              stroke="#0A3C3C"
              strokeDasharray="2 2"
            />
            <path
              d="M353.449 19.9089C304.751 139.757 -140.165 -28.0939 77.2057 129.246"
              stroke="#0A3C3C"
              strokeDasharray="2 2"
            />
            <path
              d="M353.447 40.8072C310.395 153.894 -113.982 -2.89617 107.653 129.858"
              stroke="#0A3C3C"
              strokeDasharray="2 2"
            />
          </svg>
          <div className="relative p-3">
            <Image alt="logo" src="/images/logotype.svg" width={71} height={30} className="mb-7" />
            <div className="flex justify-center items-center mb-4 w-[260px] mx-auto min-h-[42px]">
              <span className="font-medium text-[16px] ml-auto">موجودی:</span>
              <span className="font-bold text-[24px] ml-2.5">
                {!wallet && ' '}
                {walletQuery.isPending && <CircleLoadingIcon size={15} className="animate-spin" />}
                {wallet && (numberSeparator(wallet.credit) || '0')}
              </span>
              <TomanIcon className="mr-0" size={24} />
            </div>
            <div className="text-left opacity-60 ml-16">{fullName(currentUser)}</div>
          </div>
        </div>

        <WalletHomeNavigation />
      </div>
    </>
  )
}
