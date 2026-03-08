const RequirementTypeEnums = {
  RENTAL: 'FOR_RENT',
  BUY: 'FOR_SALE',
  SWAP: 'SWAP',
}

const RequirementTypeEnumsTranslations = {
  FOR_RENT: 'رهن و اجاره',
  FOR_SALE: 'فروش',
}

const RequirementTypeNameEnums = {
  [RequirementTypeEnums.RENTAL]: 'rental',
  [RequirementTypeEnums.BUY]: 'buy',
  [RequirementTypeEnums.SWAP]: 'swap',
}

export { RequirementTypeEnums, RequirementTypeNameEnums, RequirementTypeEnumsTranslations }
