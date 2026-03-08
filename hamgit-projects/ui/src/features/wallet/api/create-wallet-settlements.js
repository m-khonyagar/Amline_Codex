import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiCreateWalletSettlements } from '@/data/api/wallet'
import { walletQueryKey } from './get-wallet'
import { walletSettlementsQueryKey } from './get-wallet-settlements'

const useCreateWalletSettlements = (options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiCreateWalletSettlements,

    ...options,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: walletQueryKey })
      queryClient.invalidateQueries({ queryKey: walletSettlementsQueryKey })
      options.onSuccess?.(res)
    },
  })
}

export default useCreateWalletSettlements
