const SettlementStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  REJECTED: 'REJECTED',
}

const SettlementStatusOptions = [
  {
    value: SettlementStatus.PENDING,
    label: 'در انتظار تایید',
    variant: 'warning',
  },
  {
    value: SettlementStatus.SUCCESS,
    label: 'تایید شده',
    variant: 'success',
  },
  {
    value: SettlementStatus.REJECTED,
    label: 'رد شده',
    variant: 'danger',
  },
]

export { SettlementStatus, SettlementStatusOptions }
