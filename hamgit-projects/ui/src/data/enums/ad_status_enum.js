const AdStatusEnums = {
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
}

const AdStatusEnumsTranslations = {
  [AdStatusEnums.PUBLISHED]: 'منتشر شده',
  [AdStatusEnums.REJECTED]: 'ردشده',
  [AdStatusEnums.PENDING]: 'در صف انتشار',
}

export { AdStatusEnums, AdStatusEnumsTranslations }
