import LoadingAndRetry from '@/components/LoadingAndRetry'
import { useGetFileTexts } from '../../api/get-history-files'
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

export function SmsTab({ fileId }) {
  const fileTextsQuery = useGetFileTexts(fileId)
  const texts = fileTextsQuery.data || []

  return (
    <LoadingAndRetry query={fileTextsQuery}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">تاریخ ارسال</TableHead>
            <TableHead className="text-center">ارسال کننده</TableHead>
            <TableHead className="text-center">دریافت کننده</TableHead>
            <TableHead className="w-2/5 text-center">متن پیام</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {texts.map((text) => (
            <TableRow key={text.id}>
              <TableCell className="fa text-center">
                {format(text.created_at, 'yyyy/MM/dd')}
              </TableCell>
              <TableCell className="text-center">{text.user?.fullname}</TableCell>
              <TableCell className="fa text-center">{text.mobile}</TableCell>
              <TableCell className="fa text-center">{text.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {texts.length === 0 && <TableCaption>هیچ پیامکی ثبت نشده است.</TableCaption>}
      </Table>
    </LoadingAndRetry>
  )
}
