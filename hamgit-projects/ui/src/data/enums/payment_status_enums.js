import { statusTypeEnum } from '@/features/contract'

const PaymentStatusEnums = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
  PAYER_CLAIMED_TO_HAVE_PAID: 'PAYER_CLAIMED_TO_HAVE_PAID',
  PAYEE_CONFIRMED_RECEIPT: 'PAYEE_CONFIRMED_RECEIPT',
  PAYEE_DENIED_RECEIPT: 'PAYEE_DENIED_RECEIPT',
}

const PaymentStatusEnumsOptions = [
  {
    value: PaymentStatusEnums.PAID,
    type: statusTypeEnum.SUCCESS,
    label: 'پرداخت شده',
  },
  {
    value: PaymentStatusEnums.UNPAID,
    type: statusTypeEnum.WARNING,
    label: 'پرداخت نشده',
  },
  {
    value: PaymentStatusEnums.OVERDUE,
    type: statusTypeEnum.WARNING,
    label: 'موعد پرداخت',
  },
  {
    value: PaymentStatusEnums.CANCELLED,
    type: statusTypeEnum.DANGER,
    label: 'رد شده',
  },
  {
    value: PaymentStatusEnums.PAYER_CLAIMED_TO_HAVE_PAID,
    type: statusTypeEnum.WARNING,
    label: 'در انتظار تایید',
  },
  {
    value: PaymentStatusEnums.PAYEE_CONFIRMED_RECEIPT,
    type: statusTypeEnum.SUCCESS,
    label: 'پرداخت شده',
  },
  {
    value: PaymentStatusEnums.PAYEE_DENIED_RECEIPT,
    type: statusTypeEnum.DANGER,
    label: 'رد شده',
  },
]

export { PaymentStatusEnums, PaymentStatusEnumsOptions }
