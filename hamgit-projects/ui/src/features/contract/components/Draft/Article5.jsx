import { format } from 'date-fns-jalali'
import { numberSeparator } from '@/utils/number'
import CollapseBox from '@/components/ui/CollapseBox'

function Article5({ contract }) {
  return (
    <div className="bg-background rounded-2xl p-4 shadow-xl fa">
      <CollapseBox label="ماده 5: شرایط تحویل ملک" contentClassName="border-t mt-5">
        <div className="my-5">
          <p>
            <span>موجر باید در تاریخ </span>
            <span className="text-primary">
              {format(contract.property_handover_date, 'yyyy/MM/dd')}
            </span>
            <span> ملک موضوع معامله را با تمام توابع و ملحقات آن جهت استفاده </span>
            <span className="text-primary">{contract.property_type}</span>
            <span> به مستاجر تقدیم کند.</span>
          </p>
          <p>
            <span>در صورت عدم انجام تعهد فوق موجر باید به ازای هر روز تاخیر در تحویل مبلغ </span>
            <span className="text-primary">
              {numberSeparator(contract.landlord_penalty_fee * 10)}
            </span>
            <span> ريال به مستاجر پرداخت کند.</span>
          </p>
        </div>
      </CollapseBox>
    </div>
  )
}

export default Article5
