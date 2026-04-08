import { format } from 'date-fns-jalali'
import Link from 'next/link'
import { CircleCheckBoldIcon, ClockIcon } from '@/components/icons'
import { cn } from '@/utils/dom'

function ContractProcessItem({ date, link, error, label, status, completed }) {
  const Comp = link ? Link : 'div'

  return (
    <Comp
      className="bg-background rounded-2xl shadow-xl relative flex gap-4 py-2 pr-4 pl-2.5"
      href={link}
    >
      <div
        className={`z-0 absolute top-0 right-7 h-full w-[3px] flex items-center justify-center ${completed ? 'bg-success' : 'bg-gray-200'}`}
      >
        <div className={`z-100 bg-white ${completed ? 'text-success' : 'text-gray-200'} `}>
          {completed ? (
            <CircleCheckBoldIcon size={19} />
          ) : (
            <div className="w-[19px] h-[19px] rounded-full border-[3px] border-inherit" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full pr-10">
        <p>{label}</p>

        <div className="flex justify-between items-center min-h-5">
          <div
            className={cn('text-sm', {
              'text-success': completed,
              'text-red-600': error,
              'text-yellow-600': !completed && !error,
            })}
          >
            {status}
          </div>

          {date && (
            <div className="flex gap-2 text-sm text-gray-300 fa">
              <ClockIcon size={16} />
              {format(date, 'yyyy/MM/dd - HH:mm')}
            </div>
          )}
        </div>
      </div>
    </Comp>
  )
}

export default ContractProcessItem
