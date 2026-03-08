import { fullName } from '@/utils/dom'
import { format } from 'date-fns-jalali'
import { numberSeparator } from '@/utils/number'
import SettlementRequestStatus from '../SettlementRequestStatus'

const SettlementRequestView = ({ settlementRequest = {} }) => {
  return (
    <div className="p-4 flex flex-col fa divide-y">
      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">شناسه:</div>
        <div className="mr-auto">{settlementRequest.id || '-'}</div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">موبایل:</div>
        <div className="mr-auto">{settlementRequest.user?.mobile || '-'}</div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">نام کاربر:</div>
        <div className="mr-auto">
          {settlementRequest.user ? fullName(settlementRequest.user) : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">مبلغ:</div>
        <div className="mr-auto">
          {numberSeparator(settlementRequest.amount)}
          <span className="text-sm mr-1">تومان</span>
        </div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">تاریخ ایجاد:</div>
        <div className="mr-auto">
          {settlementRequest.created_at
            ? format(settlementRequest.created_at, 'dd MMMM yyyy HH:MM')
            : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">شماره شبا:</div>
        <div className="mr-auto">{settlementRequest.shaba ? settlementRequest.shaba : '-'}</div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">نام صاحب حساب:</div>
        <div className="mr-auto">
          {settlementRequest.shaba_owner ? settlementRequest.shaba_owner : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">توضیحات:</div>
        <div className="mr-auto">
          {settlementRequest.description ? settlementRequest.description : '-'}
        </div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">وضعیت:</div>
        <div className="mr-auto">
          {settlementRequest.status ? (
            <SettlementRequestStatus status={settlementRequest.status} />
          ) : (
            '-'
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 py-2 hover:bg-gray-50">
        <div className="text-sm text-gray-700 mt-1">تاریخ تسویه:</div>
        <div className="mr-auto">
          {settlementRequest.settled_at
            ? format(settlementRequest.settled_at, 'dd MMMM yyyy HH:MM')
            : '-'}
        </div>
      </div>
    </div>
  )
}

export default SettlementRequestView
