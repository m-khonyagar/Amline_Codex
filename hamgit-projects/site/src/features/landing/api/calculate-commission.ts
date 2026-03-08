import { httpApi } from '@/lib/http-api'

export type CommissionRequest = {
  rent_amount: number
  security_deposit_amount: number
}

export type CommissionResponse = {
  commission: number
  tax: number
  total: number
}

export const calculateRentalCommission = async (data: CommissionRequest) => {
  const response = await httpApi.post<CommissionResponse>('/users/calculate/rent-commission', data)
  return response.data
}
