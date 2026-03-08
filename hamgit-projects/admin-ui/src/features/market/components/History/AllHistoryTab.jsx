import { format } from 'date-fns-jalali'
import { useGetAllHistoryFiles } from '../../api/get-history-files'
import { formatActivityValue, labels } from './ActivityTab'
import LoadingAndRetry from '@/components/LoadingAndRetry'

export const AllHistoryTab = ({ fileId }) => {
  const allHistoryFilesQuery = useGetAllHistoryFiles(fileId)
  const allHistory = allHistoryFilesQuery.data || []

  return (
    <LoadingAndRetry query={allHistoryFilesQuery}>
      <ul>
        {allHistory.map((item) => {
          if (item.type === 'history') {
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-2 border-b border-gray-200 fa"
              >
                {item.entity_field === 'created_by' ? (
                  <span className="text-nowrap mx-auto">
                    این فایل توسط <b>{item.user?.fullname}</b> در تاریخ{' '}
                    <b>{format(item.created_at, 'yyyy/MM/dd - HH:mm')}</b> ایجاد شد.
                  </span>
                ) : (
                  <>
                    <span className="text-nowrap">{labels[item.entity_field]}</span>
                    <span className="text-[#B3B3B3] text-nowrap text-center">
                      {format(item.created_at, 'yyyy/MM/dd - HH:mm')} ({item.user?.fullname})
                    </span>
                    <div className="flex items-center flex-nowrap justify-end gap-2.5">
                      <span>{formatActivityValue(item.old_value, item.entity_field)}</span>
                      <span>{'>'}</span>
                      <span>{formatActivityValue(item.new_value, item.entity_field)}</span>
                    </div>
                  </>
                )}
              </li>
            )
          }

          if (item.type === 'call') {
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-2 border-b border-gray-200 fa"
              >
                <div className="text-nowrap">تماس</div>
                <div className="text-[#B3B3B3] text-nowrap text-center">
                  {format(item.created_at, 'yyyy/MM/dd - HH:mm')} ({item.user?.fullname})
                </div>
                <div>{item.description}</div>
              </li>
            )
          }

          if (item.type === 'text') {
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-2 border-b border-gray-200 fa"
              >
                <div className="text-nowrap">پیامک</div>
                <div className="text-[#B3B3B3] text-nowrap text-center">
                  {format(item.created_at, 'yyyy/MM/dd - HH:mm')} ({item.user?.fullname})
                </div>
                <div>{item.text}</div>
              </li>
            )
          }

          return null
        })}
      </ul>
    </LoadingAndRetry>
  )
}
