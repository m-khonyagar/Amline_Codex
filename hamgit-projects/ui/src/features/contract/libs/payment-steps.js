const paymentSteps = [
  {
    title: 'رهن (قرض الحسنه)',
    link: 'mortgage',
    isActive: true,
    completed: false,
    checkCompleted: (statuses) => !!statuses.steps.DEPOSIT_PAYMENT,
  },
  {
    title: 'اجاره',
    link: 'rental',
    isActive: true,
    completed: false,
    checkCompleted: (statuses) => !!statuses.steps.RENT_PAYMENT,
  },
]

const getPaymentSteps = (statuses) => {
  return paymentSteps.map((step) => ({
    ...step,
    completed: step.checkCompleted ? step.checkCompleted(statuses, step) : step.completed,
  }))
}

export { paymentSteps, getPaymentSteps }
