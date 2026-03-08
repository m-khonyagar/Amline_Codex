import { useState } from 'react'
import { useGetUserInfo } from '../api/get-user-info'
import { format } from 'date-fns-jalali'
import LoginAsUser from '../components/LoginAsUser'
import Button from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { WalletManualCharge } from '@/features/wallet'
import { CallDetailsRecord } from '../components/CallDetailsRecord'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { userGenderTranslation, userRolesTranslation } from '@/data/enums/user-enums'
import { CircleBigCheckIcon, CircleCloseIcon } from '@/components/icons'
import { Badge } from '@/components/ui/Badge'
import SendUserText from '../components/SendUserText'
import { numberSeparator } from '@/utils/number'

export const UserInfo = ({ userId }) => {
  const getUserQuery = useGetUserInfo(userId)
  const user = getUserQuery.data

  const [isOpenWalletManualCharge, setIsOpenWalletManualCharge] = useState(false)
  const [isOpenCallLogDialog, setIsOpenCallLogDialog] = useState(false)
  const [isOpenSMSDialog, setIsOpenSMSDialog] = useState(false)

  return (
    <>
      <div className="p-5 bg-white rounded-2xl flex flex-wrap gap-20 fa">
        <LoadingAndRetry query={getUserQuery}>
          <div className="space-y-2">
            <div className="flex-wrap">
              <span className="text-gray-700">نام: </span>
              <span>{user?.first_name || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">نام خانوادگی: </span>
              <span>{user?.last_name || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">نام پدر: </span>
              <span>{user?.father_name || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">موبایل: </span>
              <span>{user?.mobile || '-'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex-wrap">
              <span className="text-gray-700">ایمیل: </span>
              <span>{user?.email || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">جنسیت: </span>
              <span>{userGenderTranslation[user?.gender] || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">کد ملی: </span>
              <span>{user?.national_code || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">تاریخ تولد: </span>
              <span>{user?.birth_date && format(user.birth_date, 'yyyy/MM/dd')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex-wrap">
              <span className="text-gray-700">شناسه: </span>
              <span>{user?.id || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">نقش‌ها: </span>
              <span>
                {user?.roles.length > 0
                  ? user.roles.map((role) => userRolesTranslation[role] || '').join(', ')
                  : '-'}
              </span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">کد پستی: </span>
              <span>{user?.postal_code || '-'}</span>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">آدرس: </span>
              <span>{user?.address || '-'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex-wrap flex items-center gap-2">
              <div className="text-gray-700">برچسب ها:</div>
              <div>
                {user?.labels && user.labels.length > 0
                  ? user.labels.map((label) => (
                      <Badge variant="outline" key={label.id} className="ml-1 text-xs">
                        {label.title}
                      </Badge>
                    ))
                  : '-'}
              </div>
            </div>

            <div className="flex-wrap flex items-center gap-2">
              <div className="text-gray-700">فعال:</div>
              <div>
                {user?.is_active ? (
                  <CircleBigCheckIcon className="text-primary" />
                ) : (
                  <CircleCloseIcon className="text-red-600" />
                )}
              </div>
            </div>

            <div className="flex-wrap flex items-center gap-2">
              <div className="text-gray-700">احراز هویت:</div>
              <div>
                {user?.is_verified ? (
                  <CircleBigCheckIcon className="text-primary" />
                ) : (
                  <CircleCloseIcon className="text-red-600" />
                )}
              </div>
            </div>

            <div className="flex-wrap">
              <span className="text-gray-700">کیف پول: </span>
              <span className="fa">
                {user?.wallet ? `${numberSeparator(user.wallet?.credit)} تومان` : '-'}
              </span>
            </div>
          </div>

          <div className="self-center space-y-2 mr-auto">
            <div className="flex items-center gap-2">
              <LoginAsUser userId={userId} className="basis-1/2" />

              <Button
                variant="outline"
                size="sm"
                className="basis-1/2"
                onClick={() => setIsOpenCallLogDialog(true)}
              >
                ثبت جزئیات تماس
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="basis-1/3"
                size="sm"
                href={`/users/${userId}/edit`}
              >
                ویرایش
              </Button>

              <Button
                variant="outline"
                className="basis-1/3"
                size="sm"
                onClick={() => setIsOpenSMSDialog(true)}
              >
                ارسال متن
              </Button>

              <Button
                variant="outline"
                className="basis-1/3"
                size="sm"
                onClick={() => setIsOpenWalletManualCharge(true)}
              >
                شارژ اعتبار
              </Button>
            </div>
          </div>
        </LoadingAndRetry>
      </div>

      <Dialog open={isOpenWalletManualCharge} onOpenChange={setIsOpenWalletManualCharge}>
        <WalletManualCharge
          userId={userId}
          onCancel={() => setIsOpenWalletManualCharge(false)}
          onSuccess={() => setIsOpenWalletManualCharge(false)}
        />
      </Dialog>

      <Dialog
        title="ثبت جزئیات تماس"
        open={isOpenCallLogDialog}
        onOpenChange={setIsOpenCallLogDialog}
      >
        <CallDetailsRecord
          userId={userId}
          onSuccess={() => setIsOpenCallLogDialog(false)}
          onCanceled={() => setIsOpenCallLogDialog(false)}
        />
      </Dialog>

      <Dialog title="ارسال متن به کاربر" open={isOpenSMSDialog} onOpenChange={setIsOpenSMSDialog}>
        <SendUserText
          userId={userId}
          onSuccess={() => setIsOpenSMSDialog(false)}
          onCanceled={() => setIsOpenSMSDialog(false)}
        />
      </Dialog>
    </>
  )
}
