import { useMemo } from 'react'
import { checkContractSignedByCurrentUser } from '../libs/contract'
import { prContractPartyTypeEnum } from '@/features/contract'

const useContractLogic = (statuses) => {
  const ownerPartyType = useMemo(() => statuses?.owner_party_type, [statuses])
  const currentUserPartyType = useMemo(() => statuses?.current_user_party_type, [statuses])

  const signedByCurrentUser = useMemo(
    () => checkContractSignedByCurrentUser(statuses, currentUserPartyType),
    [statuses, currentUserPartyType]
  )

  const isCurrentUserFirstSide = useMemo(
    () => currentUserPartyType === prContractPartyTypeEnum.LANDLORD,
    [currentUserPartyType]
  )

  const isCurrentUserSecondSide = useMemo(
    () => currentUserPartyType === prContractPartyTypeEnum.TENANT,
    [currentUserPartyType]
  )

  const currentUserIsOwner = useMemo(
    () => currentUserPartyType === ownerPartyType,
    [currentUserPartyType, ownerPartyType]
  )

  const rejectedBySecondSide = useMemo(() => !!statuses?.steps?.TENANT_REJECTED, [statuses])

  const rejectedByFirstSide = useMemo(() => !!statuses?.steps?.LANDLORD_REJECTED, [statuses])

  const signedByFirstSide = useMemo(() => !!statuses?.steps?.LANDLORD_SIGNATURE, [statuses])

  const signedBySecondSide = useMemo(() => !!statuses?.steps?.TENANT_SIGNATURE, [statuses])

  const canViewDraft = useMemo(() => {
    const steps = statuses?.steps
    const dataCompleted =
      steps?.LANDLORD_INFORMATION &&
      steps?.DATES_AND_PENALTIES &&
      steps?.DEPOSIT_PAYMENT &&
      steps?.RENT_PAYMENT &&
      steps?.PROPERTY_DETAILS &&
      steps?.PROPERTY_FACILITIES &&
      steps?.PROPERTY_SPECIFICATIONS &&
      steps.ADD_COUNTER_PARTY

    if (statuses?.owner_party_type === prContractPartyTypeEnum.LANDLORD) {
      if (statuses?.current_user_party_type === prContractPartyTypeEnum.LANDLORD) {
        return !!dataCompleted
      }
      if (statuses?.current_user_party_type === prContractPartyTypeEnum.TENANT) {
        return steps.TENANT_INFORMATION
      }
    }
    if (statuses?.owner_party_type === prContractPartyTypeEnum.TENANT) {
      if (statuses?.current_user_party_type === prContractPartyTypeEnum.LANDLORD) {
        return !!dataCompleted
      }
      if (statuses?.current_user_party_type === prContractPartyTypeEnum.TENANT) {
        return steps.LANDLORD_SIGNATURE
      }
    }
    return false
  }, [statuses])

  const canRejectOrRevisionRequest = useMemo(() => {
    if (!currentUserIsOwner) {
      if (isCurrentUserFirstSide) {
        return !rejectedByFirstSide
      }
      if (isCurrentUserSecondSide) {
        return signedByFirstSide && !rejectedBySecondSide
      }
    }
    return false
  }, [
    currentUserIsOwner,
    isCurrentUserSecondSide,
    isCurrentUserFirstSide,
    rejectedByFirstSide,
    signedByFirstSide,
    rejectedBySecondSide,
  ])

  const hasRejectOrRevisionRequest = useMemo(() => {
    const steps = statuses?.steps || {}
    return (
      steps.TENANT_REJECTED ||
      steps.LANDLORD_REJECTED ||
      steps.TENANT_EDIT_REQUEST ||
      steps.LANDLORD_EDIT_REQUEST
    )
  }, [statuses])

  return {
    canViewDraft,
    ownerPartyType,
    signedByCurrentUser,
    currentUserPartyType,
    isCurrentUserFirstSide,
    isCurrentUserSecondSide,
    signedByFirstSide,
    signedBySecondSide,
    canRejectOrRevisionRequest,
    hasRejectOrRevisionRequest,
    currentUserIsOwner,
  }
}

export default useContractLogic
