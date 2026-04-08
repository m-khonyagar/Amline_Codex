import { prContractPartyTypeEnum } from '@/features/contract'

const checkContractSignedByCurrentUser = (statuses, currentUserPartyType) => {
  if (!statuses?.steps) {
    return undefined
  }

  if (currentUserPartyType === prContractPartyTypeEnum.LANDLORD) {
    return !!statuses.steps?.LANDLORD_SIGNATURE
  }

  if (currentUserPartyType === prContractPartyTypeEnum.TENANT) {
    return !!statuses.steps?.TENANT_SIGNATURE
  }

  return undefined
}

export { checkContractSignedByCurrentUser }
