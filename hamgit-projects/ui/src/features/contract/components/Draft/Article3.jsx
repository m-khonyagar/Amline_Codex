import { useMemo } from 'react'
import { format } from 'date-fns-jalali'
import { differenceInDays } from 'date-fns'
import CollapseBox from '@/components/ui/CollapseBox'

const tableKeyClass = 'border border-slate-950 py-1.5'
const tableValueCssClasses = 'border border-slate-950 py-1.5 text-primary'

function Article3({ contract }) {
  const contractDate = useMemo(() => contract?.contract?.date || contract?.date, [contract])

  return (
    <div className="bg-background rounded-2xl p-4 shadow-xl fa">
      <CollapseBox label="ماده 3: مدت اجاره" contentClassName="border-t mt-5">
        <div className="my-5">
          <div className="text-center">
            <table className="border-collapse border border-slate-400 w-full text-xs mb-5">
              <tbody>
                <tr>
                  <td className={tableKeyClass}>عقد قرارداد</td>
                  <td className={tableValueCssClasses}>
                    {contractDate && format(contractDate, 'yyyy-MM-dd')}
                  </td>
                  <td className={tableKeyClass}>تحویل ملک</td>
                  <td className={tableValueCssClasses}>
                    {format(contract?.property_handover_date, 'yyyy-MM-dd')}
                  </td>
                </tr>
                <tr>
                  <td className={tableKeyClass}>شروع اجاره</td>
                  <td className={tableValueCssClasses}>
                    {format(contract?.start_date, 'yyyy-MM-dd')}
                  </td>
                  <td className={tableKeyClass}>پایان اجاره</td>
                  <td className={tableValueCssClasses}>
                    {format(contract?.end_date, 'yyyy-MM-dd')}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-zinc-400">
              برابر با
              <span className="inline-block px-1">
                {-differenceInDays(contract.start_date, contract.end_date)}
              </span>
              روز
            </p>
          </div>
        </div>
      </CollapseBox>
    </div>
  )
}

export default Article3
