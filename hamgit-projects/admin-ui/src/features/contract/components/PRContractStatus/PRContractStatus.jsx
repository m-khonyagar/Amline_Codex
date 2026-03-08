import { cn } from '@/utils/dom'
import { format } from 'date-fns-jalali'
import Button from '@/components/ui/Button'
import { CircleCheckBoldIcon } from '@/components/icons'
import LoadingAndRetry from '@/components/LoadingAndRetry'
import { PRContractStep } from '@/data/enums/prcontract-enums'
import { useGetPRContractStatus } from '../../api/get-pr-contract-status'

const ProgressItem = ({ label, completedDate, className, labelClassName, children }) => {
  return (
    <div className={cn('bg-white rounded-lg px-4', className)}>
      <div
        className={cn('text-sm flex gap-1.5 items-center', {
          'text-teal-600': !!completedDate,
          'text-gray-600': !completedDate,
        })}
      >
        {completedDate ? (
          <CircleCheckBoldIcon size={12} />
        ) : (
          <div className="rounded-full border border-gray-400 w-[12px] h-[12px]" />
        )}

        <span className={cn(labelClassName)}>{label}</span>

        {completedDate && typeof completedDate == 'string' && (
          <span className="mr-auto text-xs text-gray-500">
            {format(completedDate, 'dd MMMM yyyy HH:mm')}
          </span>
        )}
      </div>

      {children && <div className="mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  )
}

const STEPS = [
  {
    id: 1,
    label: 'تکمیل اطلاعات طرفین',
    children: [
      {
        id: 1,
        label: 'اطلاعات مالک',
        key: PRContractStep.LANDLORD_INFORMATION,
      },
      {
        id: 2,
        label: 'اطلاعات مستاجر',
        key: PRContractStep.TENANT_INFORMATION,
      },
    ],
  },
  {
    id: 2,
    label: 'اطلاعات ملک',
    children: [
      {
        id: 1,
        label: 'مشخصات ملک',
        key: PRContractStep.PROPERTY_SPECIFICATIONS,
      },
      {
        id: 2,
        label: 'جزئیات ملک',
        key: PRContractStep.PROPERTY_DETAILS,
      },
      {
        id: 3,
        label: 'امکانات ملک',
        key: PRContractStep.PROPERTY_FACILITIES,
      },
    ],
  },
  {
    id: 3,
    label: 'تاریخ و پرداخت‌ها',
    children: [
      {
        id: 1,
        label: 'تاریخ و وجوه التزام',
        key: PRContractStep.DATES_AND_PENALTIES,
      },
      {
        id: 2,
        label: 'تنظیم مبلغ رهن',
        key: PRContractStep.DEPOSIT,
      },
      {
        id: 3,
        label: 'نهایی شدن پرداخت‌های رهن',
        key: PRContractStep.DEPOSIT_PAYMENT,
      },
      {
        id: 4,
        label: 'تنظیم مبلغ اجاره ماهیانه',
        key: PRContractStep.MONTHLY_RENT,
      },
      {
        id: 5,
        label: 'نهایی شدن پرداخت‌های اجاره',
        key: PRContractStep.RENT_PAYMENT,
      },
    ],
  },
  {
    id: 4,
    label: 'امضا',
    children: [
      {
        id: 1,
        label: 'امضا مالک',
        key: PRContractStep.LANDLORD_SIGNATURE,
      },
      {
        id: 2,
        label: 'امضا مستاجر',
        key: PRContractStep.TENANT_SIGNATURE,
      },
    ],
  },
  {
    id: 5,
    label: 'کمیسیون',
    children: [
      {
        id: 1,
        label: 'کمیسیون مالک',
        key: PRContractStep.LANDLORD_COMMISSION,
      },
      {
        id: 2,
        label: 'کمیسیون مستاجر',
        key: PRContractStep.TENANT_COMMISSION,
      },
    ],
  },
  {
    id: 6,
    label: 'تایید کارشناس',
    key: PRContractStep.ADMIN_APPROVE,
  },
]

const PRContractStatus = ({ contractId, className }) => {
  const prContractStatusQuery = useGetPRContractStatus(contractId)

  const status = prContractStatusQuery.data

  const steps = status?.steps

  return (
    <div className={cn('fa', className)}>
      <div className="border-b mb-4 flex flex-wrap items-center min-h-[44px]">
        <h2 className="font-semibold my-2">وضعیت قرارداد در یک نگاه</h2>

        <Button
          size="xs"
          variant="gray"
          className="mr-auto my-2"
          onClick={() => prContractStatusQuery.refetch()}
        >
          بروزرسانی
        </Button>
      </div>

      <LoadingAndRetry query={prContractStatusQuery} checkRefetching>
        {steps && (
          <div className="flex flex-col gap-2">
            {STEPS.map((s) => (
              <ProgressItem
                key={s.id}
                label={s.label}
                className="py-2"
                labelClassName="font-bold"
                completedDate={
                  s.children?.length > 0 ? s.children.every((c) => !!steps[c.key]) : steps[s.key]
                }
              >
                {s.children?.length > 0 &&
                  s.children.map((child) => (
                    <ProgressItem
                      key={child.id}
                      label={child.label}
                      completedDate={steps[child.key]}
                    />
                  ))}
              </ProgressItem>
            ))}
          </div>
        )}
      </LoadingAndRetry>
    </div>
  )
}

export default PRContractStatus
