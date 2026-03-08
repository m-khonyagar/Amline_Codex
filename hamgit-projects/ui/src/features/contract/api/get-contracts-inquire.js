import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGetPrContractsInquire } from '@/data/api/contract'

const generateContractInquiryKey = (key, password) => {
  return ['contract-inquiry', key, password]
}

/**
 * @param contractId
 * @param password
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
const useGetContractInquiry = (contractId, password, options = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiGetPrContractsInquire(contractId, { password }),
    select: (res) => res.data,
    onSuccess: (res) => {
      queryClient.setQueryData(generateContractInquiryKey(contractId, password), res)

      options.onSuccess?.(res)
    },
    ...options,
  })
}

/**
 * @param contractId
 * @param password
 * @param {import('@tanstack/react-query').UseQueryOptions} options
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
const useGetContractInquiryQuery = (contractId, password, options = {}) => {
  return useQuery({
    queryKey: generateContractInquiryKey(contractId, password),
    queryFn: () => apiGetPrContractsInquire(contractId, { password }),
    select: (res) => res.data,
    ...options,
    enabled: !!contractId && !!password,
  })
}

export { useGetContractInquiry, useGetContractInquiryQuery }
