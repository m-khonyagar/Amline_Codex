import { HandMoneyCurrencyIcon, ContractFormLogo } from '@/components/icons'
import { formatAmount } from '@/utils/number'

export const StatCards = ({ totalIncome, newContractsCount }) => {
  return (
    <>
      <div className="px-5 py-3 bg-white rounded-2xl border border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#BAAFD4]">درآمد کل</h3>
          <HandMoneyCurrencyIcon color="#BAAFD4" />
        </div>

        <div className="text-violet-300 text-sm flex items-end gap-2">
          <span className="text-violet-950 text-2xl font-medium">
            {formatAmount(totalIncome) ?? 0}
          </span>
          <span>تومان</span>
        </div>
      </div>

      <div className="px-5 py-3 bg-white rounded-2xl border border-zinc-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#BAAFD4]">تعداد قراردادهای جدید</h3>
          <ContractFormLogo color="#BAAFD4" />
        </div>

        <div className="text-violet-950 text-2xl font-medium fa">{newContractsCount ?? 0}</div>
      </div>
    </>
  )
}
