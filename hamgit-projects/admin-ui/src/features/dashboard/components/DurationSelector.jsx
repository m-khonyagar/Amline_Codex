import DatePicker from '@/components/ui/DatePicker'
import { cn } from '@/utils/dom'

export const DurationSelector = ({ duration, onChangeDuration, date, onChangeDate }) => {
  return (
    <div className="flex items-center flex-wrap gap-4">
      <div className="max-w-lg w-full flex bg-white text-violet-950 rounded-2xl border border-zinc-200">
        <button
          className={cn(
            'basis-1/4 p-2.5 text-center rounded-2xl',
            duration === 'MONTHLY' && 'bg-violet-100'
          )}
          onClick={() => onChangeDuration('MONTHLY')}
        >
          ماه
        </button>
        <button
          className={cn(
            'basis-1/4 p-2.5 text-center rounded-2xl',
            duration === 'WEEKLY' && 'bg-violet-100'
          )}
          onClick={() => onChangeDuration('WEEKLY')}
        >
          هفته
        </button>
        <button
          className={cn(
            'basis-1/4 p-2.5 text-center rounded-2xl',
            duration === 'DAILY' && 'bg-violet-100'
          )}
          onClick={() => onChangeDuration('DAILY')}
        >
          روز
        </button>
        <button
          className={cn(
            'basis-1/4 p-2.5 text-center rounded-2xl',
            duration === 'CUSTOM' && 'bg-violet-100'
          )}
          onClick={() => onChangeDuration('CUSTOM')}
        >
          بازه دلخواه
        </button>
      </div>

      {duration === 'CUSTOM' && (
        <DatePicker
          range
          value={date}
          onChange={onChangeDate}
          dateSeparator=" تا "
          inputProps={{ floatError: true }}
          containerClassName="max-w-xs w-full"
        />
      )}
    </div>
  )
}
