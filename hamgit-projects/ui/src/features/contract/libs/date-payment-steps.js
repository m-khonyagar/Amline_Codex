import { toast } from 'sonner'
import { paymentSteps } from './payment-steps'

const dateAndPaymentSteps = [
  {
    title: 'تاریخ و وجه التزام',
    link: 'date',
    isActive: true,
    completed: false,
    checkCompleted: (statuses) => !!statuses.steps.DATES_AND_PENALTIES,
  },
  {
    title: 'پرداخت ها',
    link: 'payment',
    isActive: true,
    completed: false,
    checkCompleted: (statuses) => paymentSteps.every((s) => s.checkCompleted(statuses)),
    checkIsActive: (statuses) => !!statuses.steps.DATES_AND_PENALTIES,
    onDisabledClick: () => toast.error('اول باید تاریخ قرارداد رو مشخص کنی!'),
  },
]

const getDateAndPaymentSteps = (statuses) => {
  return dateAndPaymentSteps.map((step) => ({
    ...step,
    completed: step.checkCompleted ? step.checkCompleted(statuses, step) : step.completed,
    isActive: step.checkIsActive ? step.checkIsActive(statuses, step) : step.isActive,
  }))
}

export { dateAndPaymentSteps, getDateAndPaymentSteps }
