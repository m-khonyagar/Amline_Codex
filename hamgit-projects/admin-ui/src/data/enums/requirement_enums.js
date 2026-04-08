const RequirementTypeEnums = {
  FOR_SALE: 'FOR_SALE',
  FOR_RENT: 'FOR_RENT',
}

const AdStatusEnums = {
  PUBLISHED: 'PUBLISHED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
  ARCHIVED: 'ARCHIVED',
}

const AdStatusEnumsOptions = [
  {
    value: AdStatusEnums.PUBLISHED,
    label: 'منتشر شده',
    color: 'green',
    variant: 'success',
  },
  {
    value: AdStatusEnums.ACCEPTED,
    label: 'تایید شده',
    color: 'green',
    variant: 'success',
  },
  {
    value: AdStatusEnums.REJECTED,
    label: 'رد شده',
    color: 'red',
    variant: 'danger',
  },
  {
    value: AdStatusEnums.PENDING,
    label: 'در انتظار تایید',
    color: 'yellow',
    variant: 'outline',
  },
  {
    value: AdStatusEnums.ARCHIVED,
    label: 'در انتظار تایید',
    color: 'white',
    variant: 'outline',
  },
]

export { RequirementTypeEnums, AdStatusEnums, AdStatusEnumsOptions }
