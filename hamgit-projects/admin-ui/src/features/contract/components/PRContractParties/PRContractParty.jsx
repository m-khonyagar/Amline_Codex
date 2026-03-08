import {
  ArrowSwapIcon,
  CircleBigCheckIcon,
  CircleCloseIcon,
  DocumentEditIcon,
  DocumentIcon,
  PencilIcon,
  PlusIcon,
} from '@/components/icons'
import { Dialog } from '@/components/ui/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { bankAccountTypeOptions, partyTypeOptions } from '@/data/enums/prcontract-enums'
import { cn } from '@/utils/dom'
import { findOption, translateEnum } from '@/utils/enum'
import { format } from 'date-fns-jalali'
import PRContractEditParty from './PRContractEditParty'
import { useState } from 'react'
import PRContractAddParty from './PRContractAddParty'
import { UserVerification } from '@/features/user'
import { useQueryClient } from '@tanstack/react-query'
import { generateGetPRContractPartiesQuery } from '../../api/get-pr-contract-parties'
import PRContractPartyAccountsCreation from './PRContractPartyAccountsCreation'
import PRContractPartySign from './PRContractPartySign'

const PRContractParty = ({ contractId, party, partyType, className }) => {
  const queryClient = useQueryClient()
  const [isOpenAddPartyDialog, setIsOpenAddPartyDialog] = useState(false)
  const [isOpenPartySignDialog, setIsOpenPartySignDialog] = useState(false)
  const [isOpenEditPartyDialog, setIsOpenEditPartyDialog] = useState(false)
  const [isOpenVerificationDialog, setIsOpenVerificationDialog] = useState(false)
  const [isOpenPartyAccountsDialog, setIsOpenPartyAccountsDialog] = useState(false)

  const partyTypeOption = findOption(partyTypeOptions, partyType)

  const onVerificationSuccessHandler = () => {
    queryClient.invalidateQueries({
      queryKey: generateGetPRContractPartiesQuery(contractId).queryKey,
    })
    setIsOpenVerificationDialog(false)
  }

  return (
    <div className={cn('fa bg-white rounded-lg', className)}>
      {partyTypeOption && (
        <div className="flex items-center justify-between border-b py-2 px-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">{partyTypeOption.label}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-sm border rounded-lg px-3 py-1 outline-none hover:bg-gray-200 flex items-center gap-2">
                <PencilIcon size={16} />
                عملیات
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent dir="rtl" align="end">
              {party ? (
                <>
                  <DropdownMenuItem onClick={() => setIsOpenEditPartyDialog(true)}>
                    <DocumentEditIcon size={16} />
                    ویرایش اطلاعات {partyTypeOption.label}
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setIsOpenPartyAccountsDialog(true)}>
                    <DocumentEditIcon size={16} />
                    ویرایش حساب‌های {partyTypeOption.label}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    disabled={party.is_verified}
                    onClick={() => setIsOpenVerificationDialog(true)}
                  >
                    <PlusIcon size={16} />
                    احراز هویت {partyTypeOption.label}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={party.signed_at}
                    onClick={() => setIsOpenPartySignDialog(true)}
                  >
                    <DocumentIcon size={16} />
                    امضا قرارداد
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setIsOpenAddPartyDialog(true)} disabled>
                    <ArrowSwapIcon size={16} />
                    تغییر {partyTypeOption.label} (بزودی)
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setIsOpenAddPartyDialog(true)}>
                    <PlusIcon size={16} />
                    انتخاب کاربر به عنوان {partyTypeOption.label}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {!party && <div className="p-4 text-orange-600">ثبت نشده است</div>}

      {party && (
        <div className="flex flex-wrap my-4">
          <div className="basis-full md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4 md:border-l">
            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">نام:</div>
              <div className="mr-auto">{party.first_name || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">نام خانوادگی:</div>
              <div className="mr-auto">{party.last_name || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">نام پدر:</div>
              <div className="mr-auto">{party.father_name || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">موبایل:</div>
              <div className="mr-auto">{party.mobile || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">کد ملی:</div>
              <div className="mr-auto">{party.national_code || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">تاریخ تولد:</div>
              <div className="mr-auto">
                {party.birth_date ? format(party.birth_date, 'dd MMMM yyyy') : '-'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">جنسیت:</div>
              <div className="mr-auto">{party.gender || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">کد پستی:</div>
              <div className="mr-auto">{party.postal_code || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">آدرس:</div>
              <div className="mr-auto">{party.address || '-'}</div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">فعال:</div>
              <div className="mr-auto">
                {party.is_active ? (
                  <CircleBigCheckIcon className="text-primary" />
                ) : (
                  <CircleCloseIcon className="text-red-600" />
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="text-sm text-gray-700 mt-1">احراز هویت:</div>
              <div className="mr-auto">
                {party.is_verified ? (
                  <CircleBigCheckIcon className="text-primary" />
                ) : (
                  <CircleCloseIcon className="text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div className="basis-full md:basis-1/2 py-2 px-4 flex-grow flex flex-col gap-4">
            <div className="flex items-center">
              <div className="text-sm text-gray-700">تاریخ امضا:</div>
              <div className="mr-auto">
                {party.signed_at ? (
                  <span className="text-primary">{format(party.signed_at, 'dd MMMM yyyy')}</span>
                ) : (
                  <span className="text-red-600">{partyTypeOption.label} امضا نکرده است.</span>
                )}
              </div>
            </div>

            {(party.bank_accounts || []).map((account, i) => (
              <div key={i} className="flex flex-col gap-2 border rounded-lg p-2">
                <h3 className="font-semibold">
                  حساب {translateEnum(bankAccountTypeOptions, account.type)}
                </h3>

                <div className="flex items-center">
                  <div className="text-sm text-gray-700">شماره شبا:</div>
                  <div className="mr-auto">{account.iban || '-'}</div>
                </div>

                <div className="flex items-center">
                  <div className="text-sm text-gray-700">شماره کارت:</div>
                  <div className="mr-auto">{account.card_number || '-'}</div>
                </div>

                <div className="flex items-center">
                  <div className="text-sm text-gray-700">بانک:</div>
                  <div className="mr-auto">{account.bank_name || '-'}</div>
                </div>

                <div className="flex items-center">
                  <div className="text-sm text-gray-700">به نام:</div>
                  <div className="mr-auto">{account.owner_name || '-'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog
        closeOnBackdrop={false}
        open={isOpenEditPartyDialog}
        onOpenChange={(s) => setIsOpenEditPartyDialog(s)}
        title={`ویرایش اطلاعات ${partyTypeOption.label}`}
      >
        <PRContractEditParty
          party={party}
          onCancel={() => setIsOpenEditPartyDialog(false)}
          onSuccess={() => setIsOpenEditPartyDialog(false)}
        />
      </Dialog>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenPartyAccountsDialog}
        onOpenChange={(s) => setIsOpenPartyAccountsDialog(s)}
        title={`اطلاعات حساب‌های ${partyTypeOption.label}`}
      >
        <PRContractPartyAccountsCreation
          party={party}
          partyType={partyType}
          contractId={contractId}
          onCancel={() => setIsOpenPartyAccountsDialog(false)}
          onSuccess={() => setIsOpenPartyAccountsDialog(false)}
        />
      </Dialog>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenAddPartyDialog}
        onOpenChange={(s) => setIsOpenAddPartyDialog(s)}
        title={`${party ? 'تغییر' : 'افزودن'} ${partyTypeOption.label}`}
      >
        {party?.signed_at && (
          <div className="text-sm bg-orange-50 text-orange-800 rounded-lg px-4 py-2">
            {translateEnum(partyTypeOptions, partyType)} قرارداد را امضا کرده است. با تغییر ایشان،
            امضا {translateEnum(partyTypeOptions, partyType)} حذف خواهد شد.
          </div>
        )}
        <PRContractAddParty
          contractId={contractId}
          partyType={partyType}
          onCancel={() => setIsOpenAddPartyDialog(false)}
          onSuccess={() => setIsOpenAddPartyDialog(false)}
        />
      </Dialog>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenVerificationDialog}
        onOpenChange={(s) => setIsOpenVerificationDialog(s)}
        title={`احراز هویت ${partyTypeOption.label}`}
      >
        <UserVerification
          user={party}
          onCancel={() => setIsOpenVerificationDialog(false)}
          onSuccess={onVerificationSuccessHandler}
        />
      </Dialog>

      <Dialog
        closeOnBackdrop={false}
        open={isOpenPartySignDialog}
        onOpenChange={(s) => setIsOpenPartySignDialog(s)}
        title={`امضا قرارداد توسط ${partyTypeOption.label}`}
      >
        <PRContractPartySign
          party={party}
          partyType={partyType}
          contractId={contractId}
          onCancel={() => setIsOpenPartySignDialog(false)}
          onSuccess={onVerificationSuccessHandler}
        />
      </Dialog>
    </div>
  )
}

export default PRContractParty
