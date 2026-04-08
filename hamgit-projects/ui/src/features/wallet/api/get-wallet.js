import { useQuery } from '@tanstack/react-query'
import { apiGetWallet } from '@/data/api/wallet'

export const walletQueryKey = ['financials-wallet']

const useGetWallet = (options = {}) => {
  return useQuery({
    queryKey: walletQueryKey,
    queryFn: apiGetWallet,
    ...options,
  })
}

export default useGetWallet
