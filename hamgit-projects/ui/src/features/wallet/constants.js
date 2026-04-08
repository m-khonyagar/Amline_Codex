import { statusTypeEnum } from '@/features/contract'

const walletTransactionCategory = {
  RENT: 'RENT',
  DEPOSIT: 'DEPOSIT',
  COMMISSION: 'COMMISSION',
  CUSTOM_PAYMENT: 'CUSTOM_PAYMENT',
  WALLET_CHARGE: 'WALLET_CHARGE',
  WALLET_WITHDRAW: 'WALLET_WITHDRAW',
  REFUND: 'REFUND',
  MANUAL_CHARGE: 'MANUAL_CHARGE',
}

const walletTransactionCategoryTranslations = {
  [walletTransactionCategory.RENT]: 'اجاره بها',
  [walletTransactionCategory.DEPOSIT]: 'رهن',
  [walletTransactionCategory.COMMISSION]: 'کمیسیون',
  [walletTransactionCategory.CUSTOM_PAYMENT]: 'لینک پرداخت',
  [walletTransactionCategory.WALLET_CHARGE]: 'افزایش موجودی',
  [walletTransactionCategory.WALLET_WITHDRAW]: 'برداشت',
  [walletTransactionCategory.REFUND]: 'بازگشت وجه',
  [walletTransactionCategory.MANUAL_CHARGE]: 'اعتبار هدیه',
}

const settlementStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  REJECTED: 'REJECTED',
}

const settlementStatusOptions = [
  {
    value: settlementStatus.PENDING,
    type: statusTypeEnum.WARNING,
    label: 'در انتظار تایید کارشناس',
  },
  {
    value: settlementStatus.SUCCESS,
    type: statusTypeEnum.SUCCESS,
    label: 'تایید شده توسط کارشناس',
  },
  {
    value: settlementStatus.REJECTED,
    type: statusTypeEnum.DANGER,
    label: 'رد شده توسط کارشناس',
  },
]

export { walletTransactionCategory, walletTransactionCategoryTranslations, settlementStatusOptions }
