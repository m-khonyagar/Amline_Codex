const commissionCategoryEnum = {
  RENTAL: 1,
  BUY: 2,
}
const commissionCalculateOptions = [
  {
    value: commissionCategoryEnum.RENTAL,
    label: ' اجاره',
  },
  {
    value: commissionCategoryEnum.BUY,
    label: 'خرید ',
  },
]

export { commissionCalculateOptions, commissionCategoryEnum }
