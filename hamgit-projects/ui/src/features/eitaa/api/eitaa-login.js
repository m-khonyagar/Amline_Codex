import { useMutation } from '@tanstack/react-query'
import { apiEitaaLogin, apiEitaaLoginWithId } from '@/data/api/auth'

/**
 * send Eitaa login mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useEitaaLogin = (options = {}) => {
  return useMutation({
    mutationFn: apiEitaaLogin,
    ...options,
  })
}

/**
 * send Eitaa login with id mutation
 * @param {import('@tanstack/react-query').UseMutationOptions} options
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useEitaaLoginWithId = (options = {}) => {
  return useMutation({
    mutationFn: apiEitaaLoginWithId,
    ...options,
  })
}
