import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetFileCalls } from '../../api/get-history-files'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { format } from 'date-fns-jalali'

export const CallTab = ({ fileId }) => {
  const fileCallsQuery = useGetFileCalls(fileId)
  const calls = fileCallsQuery.data || []

  return (
    <LoadingAndRetry query={fileCallsQuery}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">تاریخ تماس</TableHead>
            <TableHead className="text-center">گیرنده تماس</TableHead>
            <TableHead className="text-center">دریافت کننده تماس</TableHead>
            <TableHead className="text-center">وضعیت تماس</TableHead>
            <TableHead className="w-2/5 text-center">توضیحات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell className="fa text-center">
                {format(call.created_at, 'yyyy/MM/dd')}
              </TableCell>
              <TableCell className="text-center">{call.user?.fullname}</TableCell>
              <TableCell className="fa text-center">{call.mobile}</TableCell>
              <TableCell className="fa text-center">
                {call.status === 'SUCCESS' ? 'موفق' : call.status === 'FAILED' ? 'ناموفق' : 'ورودی'}
              </TableCell>
              <TableCell className="fa text-center">{call.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {calls.length === 0 && <TableCaption>هیچ تماسی ثبت نشده است.</TableCaption>}
      </Table>
    </LoadingAndRetry>
  )
}
