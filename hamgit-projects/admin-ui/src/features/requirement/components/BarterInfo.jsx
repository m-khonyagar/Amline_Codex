import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useGetExchangeInfo } from '../api/get-exchange-info'
import { useAcceptExchange, useRejectExchange } from '../api/status-exchange'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import Button from '@/components/ui/Button'
import { handleErrorOnSubmit } from '@/utils/error'
import { numberSeparator } from '@/utils/number'
import { AdStatusEnums } from '@/data/enums/requirement_enums'
import { Dialog } from '@/components/ui/Dialog'
import BarterListDelete from './BarterList/BarterListDelete'
import { format } from 'date-fns-jalali'

const formattedDate = (date, formatStr) => {
  return date ? format(date.toString(), formatStr || 'HH:mm   yyyy-MM-dd') : '--'
}

const BarterInfo = ({ barterId }) => {
  const getExchangeQuery = useGetExchangeInfo(barterId)
  const navigate = useNavigate()

  const exchange = getExchangeQuery.data || {}

  const acceptExchange = useAcceptExchange()
  const rejectExchange = useRejectExchange()

  const [selectedExchangeForDelete, setSelectedExchangeForDelete] = useState(null)

  const handleAccept = () => {
    acceptExchange.mutate(exchange.id, {
      onSuccess: () => {
        toast.success('معاوضه با موفقیت منتشر شد')
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleReject = () => {
    rejectExchange.mutate(exchange.id, {
      onSuccess: () => {
        toast.success('معاوضه با موفقیت رد شد')
      },
      onError: (e) => {
        handleErrorOnSubmit(e)
      },
    })
  }

  const handleDelete = () => setSelectedExchangeForDelete(exchange)

  const tableData = [
    ['شناسه', exchange.id],
    ['نام', exchange.nick_name],
    ['موبایل', exchange.mobile],
    ['عنوان', exchange.title],
    ['چی دارم', exchange.have],
    ['چی میخوام', exchange.want],
    ['قیمت', numberSeparator(exchange.price)],
    ['ایجاد شده توسط ادمین', exchange.created_by_admin ? 'بله' : 'خیر'],
    ['تاریخ تایید', formattedDate(exchange.accepted_at)],
    ['تاریخ رد', formattedDate(exchange.rejected_at)],
    ['گزارش تخلف', exchange.report_description],
  ]

  const isAccepted = exchange.status === AdStatusEnums.PUBLISHED

  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <Button variant="outline" size="sm" href={`/requirements/barter/${barterId}/edit`}>
          ویرایش
        </Button>

        {isAccepted ? (
          <Button
            onClick={handleReject}
            size="sm"
            variant="danger"
            loading={rejectExchange.isPending}
          >
            لغو انتشار
          </Button>
        ) : (
          <Button onClick={handleAccept} size="sm" loading={acceptExchange.isPending}>
            انتشار
          </Button>
        )}

        <Button onClick={handleDelete} size="sm" variant="danger">
          حذف
        </Button>
      </div>

      <div className="max-w-[450px] w-full">
        <div className="bg-white border rounded-lg divide-y fa">
          <LoadingAndRetry query={getExchangeQuery}>
            {exchange && (
              <>
                {tableData.map((item, index) => (
                  <div key={index} className="flex py-2 px-4 flex-wrap">
                    <div className="text-sm text-gray-700 py-1">{item[0]}</div>
                    <div className="mr-auto py-1">{item[1] || '--'}</div>
                  </div>
                ))}
              </>
            )}
          </LoadingAndRetry>
        </div>
      </div>

      <Dialog
        title="حذف معاوضه"
        closeOnBackdrop={false}
        open={selectedExchangeForDelete}
        onOpenChange={(s) => setSelectedExchangeForDelete(s)}
      >
        <BarterListDelete
          exchange={selectedExchangeForDelete}
          onCancel={() => setSelectedExchangeForDelete(null)}
          onSuccess={() => {
            setSelectedExchangeForDelete(null)
            navigate(-1)
          }}
        />
      </Dialog>
    </div>
  )
}

export default BarterInfo
