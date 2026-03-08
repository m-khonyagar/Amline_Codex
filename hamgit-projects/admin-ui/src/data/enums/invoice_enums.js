export const InvoiceStatus = {
  PAID: 'PAID',
  NOT_PAID: 'NOT_PAID',
}

export const InvoiceStatusOptions = [
  { label: 'پرداخت شده', value: InvoiceStatus.PAID, color: 'teal' },
  { label: 'پرداخت نشده', value: InvoiceStatus.NOT_PAID, color: 'red' },
]

export const InvoiceItemType = {
  TAX: 'TAX',
  TRACKING_CODE: 'TRACKING_CODE',
  DELIVERY: 'DELIVERY',
  DISCOUNT: 'DISCOUNT',
  WALLET_CREDIT: 'WALLET_CREDIT',
}

export const InvoiceItemTypeOptions = [
  { label: 'مالیات', value: InvoiceItemType.TAX },
  { label: 'کد رهگیری', value: InvoiceItemType.TRACKING_CODE },
  { label: 'هزینه ارسال', value: InvoiceItemType.DELIVERY },
  { label: 'تخفیف', value: InvoiceItemType.DISCOUNT },
  { label: 'اعتبار کیف پول', value: InvoiceItemType.WALLET_CREDIT },
]

export const resourceTypeEnum = {
  RENT: 'RENT',
  DEPOSIT: 'DEPOSIT',
  COMMISSION: 'COMMISSION',
  WALLET_CHARGE: 'WALLET_CHARGE',
  CUSTOM_PAYMENT: 'CUSTOM_PAYMENT',
  WALLET_WITHDRAW: 'WALLET_WITHDRAW',
  ERNEST_MONEY: 'ERNEST_MONEY',
  REFUND: 'REFUND',
}

export const resourceTypeOptions = [
  { label: 'اجاره', value: resourceTypeEnum.RENT },
  { label: 'رهن', value: resourceTypeEnum.DEPOSIT },
  { label: 'کمیسیون', value: resourceTypeEnum.COMMISSION },
  { label: 'شارژ کیف پول', value: resourceTypeEnum.WALLET_CHARGE },
  { label: 'پرداخت سفارشی', value: resourceTypeEnum.CUSTOM_PAYMENT },
  { label: 'برداشت کیف پول', value: resourceTypeEnum.WALLET_WITHDRAW },
  { label: 'بیعانه', value: resourceTypeEnum.ERNEST_MONEY },
  { label: 'استرداد', value: resourceTypeEnum.REFUND },
]

export const discountTypeEnum = {
  PERCENTAGE: 'PERCENTAGE',
  STATIC: 'STATIC',
  FORCE: 'FORCE',
}

export const discountTypeOptions = [
  { label: 'درصدی', value: discountTypeEnum.PERCENTAGE },
  { label: 'مبلغی', value: discountTypeEnum.STATIC },
  { label: 'قیمت ثابت', value: discountTypeEnum.FORCE },
]
