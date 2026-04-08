import { useState } from 'react'
import { format } from 'date-fns-jalali'
import { Link } from 'react-router-dom'
import { useGetRealtorSharedFiles } from '../../api/get-history-files'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { Badge } from '@/components/ui/Badge'

export const RealtorSharedTab = ({ fileId }) => {
  const realtorSharedFilesQuery = useGetRealtorSharedFiles(fileId)
  const sharedFiles = realtorSharedFilesQuery.data || []
  const [expandedItems, setExpandedItems] = useState(new Set())

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'SMS':
        return 'پیامک'
      case 'DING':
        return 'پیام ایتا'
      default:
        return type
    }
  }

  const getStatusButton = (isSuccessful) =>
    isSuccessful ? (
      <Badge variant="success">ارسال موفق</Badge>
    ) : (
      <Badge variant="danger">ارسال ناموفق</Badge>
    )

  return (
    <LoadingAndRetry query={realtorSharedFilesQuery}>
      <div className="space-y-4">
        {sharedFiles.map((item) => {
          const isExpanded = expandedItems.has(item.id)

          return (
            <div key={item.id} className="border border-gray-200 rounded-lg bg-white">
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex-1 text-right">
                  <div className="text-sm text-gray-600 mb-1 fa">
                    {format(new Date(item.created_at), 'yyyy/MM/dd - HH:mm')} (
                    {item.created_by_user?.fullname})
                  </div>
                  <div className="text-sm text-gray-500 mb-2 fa">
                    به {item.realtor_file?.full_name} {item.realtor_file?.mobile}
                  </div>
                  <div className="mb-2 flex items-center gap-4">
                    {getStatusButton(item.is_successful)}
                    <Link
                      to={`/market/realtor/${item.realtor_file_id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      مشاهده مشاور
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-medium">{getTypeLabel(item.type)}</div>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {isExpanded ? 'بستن متن پیام' : 'مشاهده متن پیام'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-800 whitespace-pre-line">{item.text}</div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {sharedFiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هیچ ارسالی به مشاور املاک ثبت نشده است.
          </div>
        )}
      </div>
    </LoadingAndRetry>
  )
}
