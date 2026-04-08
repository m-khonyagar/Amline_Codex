import { useMemo, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { HeaderNavigation } from '@/features/app'
import { cn } from '@/utils/dom'
import useMyContracts from '../api/my-contracts'
import ContractCard from '../components/ContractCard'
import ContractSkeleton from '../components/ContractSkeleton'
import { PlusIcon } from '@/components/icons'
import emptyContractsIcon from '@/assets/images/empty_contract.svg'
import signContractImg from '@/assets/images/sign_contract.svg'

const CONTRACT_TABS = [
  {
    id: 'current',
    label: 'جاری',
    states: [
      'DRAFT',
      'PENDING_TENANT_APPROVAL',
      'PENDING_TENANT_INFORMATION',
      'PENDING_LANDLORD_INFORMATION',
      'LANDLORD_EDIT_REQUEST',
      'TENANT_EDIT_REQUEST',
      'PENDING_LANDLORD_SIGNATURE',
      'PADDING_TENANT_SIGNATURE',
      'PENDING_PAYING_COMMISSION',
      'PENDING_LANDLORD_COMMISSION',
      'PENDING_TENANT_COMMISSION',
      'PENDING_ADMIN_APPROVAL',
    ],
  },
  {
    id: 'completed',
    label: 'تکمیل شده',
    states: [
      'PENDING_TRACKING_CODE',
      'PENDING_TRACKING_CODE_DELIVERY',
      'TRACKING_CODE_DELIVERED',
      'PDF_GENERATED',
    ],
  },
  {
    id: 'cancelled',
    label: 'لغو شده',
    states: ['TENANT_REJECTED', 'LANDLORD_REJECTED', 'ADMIN_REJECTED'],
  },
]

function ContractListPage() {
  const [activeTab, setActiveTab] = useState('current')
  const myContractsQuery = useMyContracts({ staleTime: 0, refetchOnMount: true })
  const contracts = useMemo(() => myContractsQuery?.data || [], [myContractsQuery.data])
  const router = useRouter()
  // Custom back handler for Divar users
  const handleBack = useCallback(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('fromDivarPage') === 'true') {
      localStorage.removeItem('fromDivarPage')
      window.location.href = 'https://open-platform-redirect.divar.ir/completion'
      return
    }
    router.push('/')
  }, [router])
  const filteredContracts = useMemo(() => {
    const activeTabConfig = CONTRACT_TABS.find((tab) => tab.id === activeTab)
    return contracts.filter((contract) => activeTabConfig.states.includes(contract.state))
  }, [contracts, activeTab])

  const contractCounts = useMemo(() => {
    return CONTRACT_TABS.reduce(
      (acc, tab) => ({
        ...acc,
        [tab.id]: contracts.filter((c) => tab.states.includes(c.state)).length,
      }),
      {}
    )
  }, [contracts])

  const handleTabChange = (tabId) => setActiveTab(tabId)

  useEffect(() => {
    if (!myContractsQuery.isLoading && contracts.length === 0) router.replace('/contracts/new')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts.length, myContractsQuery.isLoading])

  return (
    <>
      <HeaderNavigation title="قراردادهای من" backUrl={null} onBack={handleBack} />

      <div className="p-4 px-6 flex-grow flex flex-col gap-7 pb-20">
        <div className="mb-2">
          <Image
            src={signContractImg.src}
            alt=""
            width={160}
            height={130}
            className="mx-auto my-2"
          />
          <Button type="button" href="/contracts/new" className="w-full mb-2">
            <PlusIcon size={20} />
            ایجاد قرارداد جدید
          </Button>
          <p className="text-sm text-[#878787] text-center">
            اینجا اگر قرارداد ناقصی داشته باشی میتونی ادامه بدی یا قرارداد جدید ایجاد کنی!
          </p>
        </div>

        <div className="flex items-center gap-3.5 py-2 border-b fa">
          {myContractsQuery.isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={i} style={{ height: 30, width: 80 }} />
              ))}
            </>
          ) : (
            <>
              {CONTRACT_TABS.map((tab) => (
                <ContractTab
                  key={tab.id}
                  label={tab.label}
                  count={contractCounts[tab.id]}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                />
              ))}
            </>
          )}
        </div>

        <LoadingAndRetry query={myContractsQuery} loadingComponent={ContractSkeleton}>
          {!myContractsQuery.isLoading && contracts.length === 0 && (
            <div className="flex-grow flex flex-col items-center justify-center gap-7">
              <Image src={emptyContractsIcon.src} width={80} height={84} alt="emptyContractsIcon" />
              <div>قراردادی ایجاد نشده</div>
            </div>
          )}

          {filteredContracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </LoadingAndRetry>
      </div>
    </>
  )
}

function ContractTab({ label, count, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 p-1 pr-3 rounded-md',
        isActive ? 'text-teal-600 bg-[#D8F0FF]' : 'text-gray-500'
      )}
    >
      {label}
      <span
        className={cn(
          'size-6 flex items-center justify-center rounded',
          isActive ? 'bg-[#D8F0FF]' : 'bg-[#D9D9D9]'
        )}
      >
        {count}
      </span>
    </button>
  )
}

export default ContractListPage
