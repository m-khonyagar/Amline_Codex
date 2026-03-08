import { useMutation } from '@tanstack/react-query'
import { calculateRentalCommission } from '../api/calculate-commission'

export const useCalculateCommission = () => {
  return useMutation({
    mutationFn: calculateRentalCommission,
  })
}
