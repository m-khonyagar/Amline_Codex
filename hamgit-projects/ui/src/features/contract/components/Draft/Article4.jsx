import { format, getDate } from 'date-fns-jalali'
import CollapseBox from '@/components/ui/CollapseBox'
import { paymentCategoryEnum } from '@/data/enums/payment_category_enums'
import { numberSeparator, numberToPersianWords } from '@/utils/number'
import {
  ChequeCategoryEnumOptions,
  paymentMethodEnum,
  personTypeEnumOptions,
} from '@/features/contract'

function PaymentTable({ payment, index }) {
  return (
    <>
      <p className="text-sm mb-2">قسط {numberToPersianWords(index + 1)}:</p>
      <div className="flex flex-row flex-wrap border border-slate-900 w-full text-sm text-center mb-5">
        {payment.method === paymentMethodEnum.CHEQUE ? (
          <>
            <div className="basis-3/12 border border-slate-900 py-3 text-primary">چک</div>
            <div className="basis-6/12 border border-slate-900 py-3">
              <span>به مبلغ</span>
              <span className="text-primary"> {numberSeparator(payment.amount)} تومان</span>
            </div>
            <div className="basis-3/12 border border-slate-900 py-3">
              <span>تاریخ سر رسید: </span>
              <span className="text-primary">{format(payment.due_date, 'yyyy/MM/dd')} </span>
            </div>
            <div className="basis-3/12 border border-slate-900 py-1.5">
              <span className="block">شماره چک</span>
              <span className="text-primary">
                {`${payment.cheque.series}/
            ${payment.cheque.serial}`}
              </span>
            </div>
            <div className="basis-6/12 border border-slate-900 py-1.5">
              <span>شناسه صیاد چک :</span>
              <span className="text-primary">{payment.cheque.sayaad_code}</span>
            </div>
            <div className="basis-3/12 border border-slate-900 py-1.5">
              <span className="block">در وجه:</span>
              <span className="text-primary">
                {personTypeEnumOptions.find((i) => i.value === payment?.cheque?.payee_type)?.label}
              </span>
            </div>
            <div className="basis-9/12 border border-slate-900 p-1.5 text-right">
              <span>بابت : </span>
              <span className="text-primary">
                {
                  ChequeCategoryEnumOptions.find((i) => i.value === payment?.cheque?.category)
                    ?.label
                }
              </span>
            </div>
            <div className="basis-3/12 border border-slate-900 py-1.5">
              <span className="block">کد ملی :</span>
              <span className="text-primary">{payment.cheque.payee_national_code}</span>
            </div>
          </>
        ) : (
          <>
            <div className="basis-3/12 border border-slate-900 py-3 text-primary">نقد</div>
            <div className="basis-6/12 border border-slate-900 py-3">
              <span>به مبلغ</span>
              <span className="text-primary"> {numberSeparator(payment.amount)} تومان</span>
            </div>
            <div className="basis-3/12 border border-slate-900 py-3">
              <span className="block">تاریخ</span>
              <span className="text-primary">{format(payment.due_date, 'yyyy/MM/dd')} </span>
            </div>
            <div className="basis-9/12 border border-slate-900 p-2 text-right">
              <span>شماره شبا مقصد : </span>
              <span className="text-primary">{payment.payee.iban || '--'}</span>
            </div>
            <div className="basis-3/12 border border-slate-900 py-2">
              <span>به‌نام: </span>
              <span className="text-primary">{payment.payee.owner_name}</span>
            </div>
            <div className="basis-full border border-slate-900 p-2 text-right">
              <span>توضیحات : </span>
              <span className="text-primary">{payment.description || '--'}</span>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function Article4({ contract, payments = [] }) {
  const mortgages = payments.filter((payment) => payment.type === paymentCategoryEnum.DEPOSIT)
  const monthlyRent = payments.find((payment) => payment.is_bulk)
  const rents = payments.filter((payment) => payment.type === paymentCategoryEnum.RENT)

  return (
    <div className="bg-background rounded-2xl p-4 shadow-xl fa">
      <CollapseBox label="ماده 4: اجاره بها و نحوه پرداخت" contentClassName="border-t mt-5">
        <div className="my-5">
          <p className="text-center font-bold mb-3">بند اول: رهن (قرض الحسنه)</p>
          <p className="text-sm mb-2">
            میزان رهن به مبلغ
            <span className="text-primary"> {numberSeparator(contract.deposit_amount)} </span>
            تومان تعیین گردید.
          </p>
          <p className="text-sm mb-5">
            موافقت شد که مستاجر طی
            <span className="text-primary"> {mortgages.length} </span>
            قسط مبلغ رهن را به مالک پرداخت نماید:
          </p>

          {mortgages.map((item, index) => (
            <PaymentTable payment={item} key={index} index={index} />
          ))}

          <div className="mt-10 mb-5 w-2/3 border-b mx-auto" />
          <p className="text-center font-bold mb-3">بند دوم: اجاره</p>
          {monthlyRent ? (
            <p>
              <span>مقرر گردید اجاره‌بها به صورت </span>
              <span className="text-primary">ماهیانه </span>
              <span> از قرار هر ماه مبلغ </span>
              <span className="text-primary">{numberSeparator(monthlyRent.amount)} تومان</span>
              <span> به عبارت </span>
              <span className="text-primary">{numberToPersianWords(monthlyRent.amount)} تومان</span>
              <span> در </span>
              <span className="text-primary">{getDate(monthlyRent.due_date)}</span>
              <span> اُم هر ماه به صورت نقدی به مالک پرداخت شود .</span>
            </p>
          ) : (
            <>
              <p className="mb-3">
                <span>مقرر گردید اجاره بها به صورت </span>
                <span className="text-primary">چک/نقد</span>
                <span> در مواعد زیر به مالک پرداخت شود :</span>
              </p>
              {rents.map((item, index) => (
                <PaymentTable payment={item} key={item.id} index={index} />
              ))}
            </>
          )}
        </div>
      </CollapseBox>
    </div>
  )
}

export default Article4
