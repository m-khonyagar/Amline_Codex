const paymentCategoryEnum = {
  DEPOSIT: 'DEPOSIT',
  RENT: 'RENT',
  COMMISSION: 'COMMISSION',
  PENALTY: 'PENALTY',
  OTHER: 'OTHER',
  CUSTOM_PAYMENT: 'CUSTOM_PAYMENT',
  WALLET_CHARGE: 'WALLET_CHARGE',
  WALLET_WITHDRAW: 'WALLET_WITHDRAW',
  REFUND: 'REFUND',
}

const paymentCategoryEnumTranslation = {
  [paymentCategoryEnum.RENT]: 'اجاره',
  [paymentCategoryEnum.DEPOSIT]: 'رهن',
  [paymentCategoryEnum.COMMISSION]: 'کمیسیون',
  [paymentCategoryEnum.PENALTY]: 'جریمه',
  [paymentCategoryEnum.OTHER]: 'سایر',
  [paymentCategoryEnum.CUSTOM_PAYMENT]: 'لینک پرداخت',
  [paymentCategoryEnum.WALLET_CHARGE]: 'افزایش موجودی',
  [paymentCategoryEnum.WALLET_WITHDRAW]: 'برداشت',
  [paymentCategoryEnum.REFUND]: 'بازگشت وجه',
}

export { paymentCategoryEnum, paymentCategoryEnumTranslation }
