import { useState } from 'react'
import { useParams } from 'react-router-dom'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import {
  useGetUserCalls,
  useGetUserFileCalls,
  useGetUserFileTexts,
  useGetUserTexts,
} from '../api/call-details'
import { format } from 'date-fns-jalali'
import { findOption, translateEnum } from '@/utils/enum'
import { userCallStatusEnum, userCallTypeEnum } from '@/data/enums/user-enums'

const tabConfig = [
  { value: 'user-calls', label: 'تماس‌های کاربر' },
  { value: 'user-texts', label: 'پیام‌های کاربر' },
  { value: 'file-calls', label: 'تماس‌های فایل‌ها' },
  { value: 'file-texts', label: 'پیام‌های فایل‌ها' },
]

const senderLabels = {
  SMS: 'اس‌ام‌اس',
  DING: 'دینگ',
}

const formatFileStatus = (status) => {
  if (status === 'SUCCESS') return 'موفق'
  if (status === 'FAILED') return 'ناموفق'
  if (status === 'INCOMING') return 'ورودی'
  if (status === 'OUTGOING') return 'خروجی'
  return status || '-'
}

export const CallDetailsList = () => {
  const { id: userId } = useParams()
  const [activeTab, setActiveTab] = useState('user-calls')

  const userCallsQuery = useGetUserCalls(userId, { enabled: activeTab === 'user-calls' })
  const userTextsQuery = useGetUserTexts(userId, { enabled: activeTab === 'user-texts' })
  const fileCallsQuery = useGetUserFileCalls(userId, { enabled: activeTab === 'file-calls' })
  const fileTextsQuery = useGetUserFileTexts(userId, { enabled: activeTab === 'file-texts' })

  const userCalls = userCallsQuery.data || []
  const userTexts = userTextsQuery.data || []
  const fileCalls = fileCallsQuery.data || []
  const fileTexts = fileTextsQuery.data || []

  return (
    <div className="bg-white rounded-2xl p-5">
      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-zinc-200 pb-1 mb-4 w-full justify-start">
          {tabConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-sm rounded-none border-none data-[state=active]:text-[#0D0C22]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="user-calls">
          <LoadingAndRetry query={userCallsQuery}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">کارشناس مربوطه</TableHead>
                  <TableHead className="text-center">تاریخ تماس</TableHead>
                  <TableHead className="text-center">نوع تماس</TableHead>
                  <TableHead className="text-center">وضعیت تماس</TableHead>
                  <TableHead className="w-2/5 text-center">توضیحات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCalls.map((call) => (
                  <TableRow key={call.id} className="fa text-center">
                    <TableCell>{call.created_by_user?.fullname || '-'}</TableCell>
                    <TableCell>
                      {call.created_at ? format(call.created_at, 'yyyy/MM/dd') : '-'}
                    </TableCell>
                    <TableCell>
                      {call?.type ? translateEnum(userCallTypeEnum, call.type) : '-'}
                    </TableCell>
                    <TableCell>
                      {call.status ? (
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={`size-5 rounded-full ${findOption(userCallStatusEnum, call.status)?.color} border border-zinc-200`}
                          />
                          {translateEnum(userCallStatusEnum, call.status)}{' '}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{call.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {userCalls.length === 0 && <TableCaption>هیچ تماسی ثبت نشده است.</TableCaption>}
            </Table>
          </LoadingAndRetry>
        </TabsContent>

        <TabsContent value="user-texts">
          <LoadingAndRetry query={userTextsQuery}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">کارشناس مربوطه</TableHead>
                  <TableHead className="text-center">تاریخ ارسال</TableHead>
                  <TableHead className="text-center">فرستنده</TableHead>
                  <TableHead className="w-1/2 text-center">متن پیام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTexts.map((text) => (
                  <TableRow key={text.id} className="fa text-center">
                    <TableCell>{text.created_by_user?.fullname || '-'}</TableCell>
                    <TableCell>
                      {text.created_at ? format(text.created_at, 'yyyy/MM/dd') : '-'}
                    </TableCell>
                    <TableCell>{senderLabels[text.sender] || text.sender || '-'}</TableCell>
                    <TableCell>{text.text || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {userTexts.length === 0 && <TableCaption>هیچ پیامی ثبت نشده است.</TableCaption>}
            </Table>
          </LoadingAndRetry>
        </TabsContent>

        <TabsContent value="file-calls">
          <LoadingAndRetry query={fileCallsQuery}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">فایل مرتبط</TableHead>
                  <TableHead className="text-center">تاریخ تماس</TableHead>
                  <TableHead className="text-center">کارشناس</TableHead>
                  <TableHead className="text-center">شماره تماس</TableHead>
                  <TableHead className="text-center">وضعیت</TableHead>
                  <TableHead className="w-2/5 text-center">توضیحات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileCalls.map((call) => (
                  <TableRow key={call.id} className="fa text-center">
                    <TableCell>
                      {call.file?.title || call.file_title || '-'}
                      {call.file?.id && (
                        <span className="block text-xs text-gray-500">#{call.file.id}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {call.created_at ? format(call.created_at, 'yyyy/MM/dd') : '-'}
                    </TableCell>
                    <TableCell>{call.created_by_user?.fullname || '-'}</TableCell>
                    <TableCell>{call.mobile || call.user?.mobile || '-'}</TableCell>
                    <TableCell>{formatFileStatus(call.status)}</TableCell>
                    <TableCell>{call.description || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {fileCalls.length === 0 && (
                <TableCaption>هیچ تماسی برای فایل‌ها ثبت نشده است.</TableCaption>
              )}
            </Table>
          </LoadingAndRetry>
        </TabsContent>

        <TabsContent value="file-texts">
          <LoadingAndRetry query={fileTextsQuery}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">فایل مرتبط</TableHead>
                  <TableHead className="text-center">تاریخ ارسال</TableHead>
                  <TableHead className="text-center">کارشناس</TableHead>
                  <TableHead className="text-center">گیرنده</TableHead>
                  <TableHead className="w-1/2 text-center">متن پیام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileTexts.map((text) => (
                  <TableRow key={text.id} className="fa text-center">
                    <TableCell>
                      {text.file?.title || text.file_title || '-'}
                      {text.file?.id && (
                        <span className="block text-xs text-gray-500">#{text.file.id}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {text.created_at ? format(text.created_at, 'yyyy/MM/dd') : '-'}
                    </TableCell>
                    <TableCell>{text.created_by_user?.fullname || '-'}</TableCell>
                    <TableCell>{text.mobile || text.user?.mobile || '-'}</TableCell>
                    <TableCell>{text.text || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {fileTexts.length === 0 && (
                <TableCaption>هیچ پیامی برای فایل‌ها ثبت نشده است.</TableCaption>
              )}
            </Table>
          </LoadingAndRetry>
        </TabsContent>
      </Tabs>
    </div>
  )
}
