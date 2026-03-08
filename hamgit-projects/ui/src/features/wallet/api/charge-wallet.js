import { useMutation } from '@tanstack/react-query'
import { apiChargeWallet } from '@/data/api/wallet'

const useChargeWallet = (options = {}) => {
  return useMutation({
    mutationFn: apiChargeWallet,
    ...options,
  })
}

export default useChargeWallet
