import Button from '@/components/ui/Button'
import { MarketRole } from '@/data/enums/market_enums'

const roles = {
  RealtorFile: {
    role: MarketRole.REALTOR,
    label: 'فایل مشاور املاک',
  },
  RENT: {
    LandlordFile: {
      role: MarketRole.LANDLORD,
      market: 'deposit-rent',
      label: 'فایل مالک',
    },
    TenantFile: {
      role: MarketRole.TENANT,
      market: 'deposit-rent',
      label: 'فایل مستاجر',
    },
  },
  SALE: {
    LandlordFile: {
      role: MarketRole.SELLER,
      market: 'buy-sell',
      label: 'فایل فروشنده',
    },
    TenantFile: {
      role: MarketRole.BUYER,
      market: 'buy-sell',
      label: 'فایل خریدار',
    },
  },
}

export default function ExistingFilesDialog({ onClose, existingFiles }) {
  return (
    <div>
      <div className="mb-2">
        <span className="text-red-600 font-bold">پرونده‌ای با این شماره موبایل وجود دارد!</span>
      </div>
      <ul className="max-h-[60vh] overflow-y-auto">
        {existingFiles.map((file) => {
          const fileData = roles[file.listing_type]?.[file.type]

          const href =
            file.type === 'RealtorFile'
              ? `/market/realtor/${file.id}`
              : `/market/${fileData?.market}/${fileData?.role}/${file.id}`

          return (
            <li key={file.id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {roles[file.type]?.label || fileData?.label} (ID: {file.id})
              </a>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex justify-end">
        <Button variant="gray" onClick={onClose}>
          صرف‌نظر و ادامه
        </Button>
      </div>
    </div>
  )
}
