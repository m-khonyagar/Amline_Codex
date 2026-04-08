import { useQuery } from '@tanstack/react-query'
import { apiGetWalletSettlements } from '@/data/api/wallet'

export const walletSettlementsQueryKey = ['wallet-settlements']

const useGetWalletSettlements = (options = {}) => {
  return useQuery({
    queryKey: walletSettlementsQueryKey,
    queryFn: apiGetWalletSettlements,
    ...options,
  })
}

export default useGetWalletSettlements
