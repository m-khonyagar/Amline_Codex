const paymentCategoryEnum = {
  DEPOSIT: 'DEPOSIT',
  RENT: 'RENT',
  COMMISSION: 'COMMISSION',
  PENALTY: 'PENALTY',
  OTHER: 'OTHER',
}

const paymentCategoryEnumTranslation = {
  [paymentCategoryEnum.RENT]: 'اجاره',
  [paymentCategoryEnum.DEPOSIT]: 'رهن',
  [paymentCategoryEnum.COMMISSION]: 'کمیسیون',
  [paymentCategoryEnum.PENALTY]: 'جریمه',
  [paymentCategoryEnum.OTHER]: 'سایر',
}

export { paymentCategoryEnum, paymentCategoryEnumTranslation }
