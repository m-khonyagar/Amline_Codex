/* eslint-disable no-nested-ternary */
import { prContractPartyTypeEnum, contractTypeEnum } from '@/features/contract'

const generateTenantStep = ({ steps, contractId }) => {
  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'تکمیل اطلاعات مستاجر',
  }

  result.completed =
    !!steps.TENANT_INFORMATION &&
    !!steps.ADD_COUNTER_PARTY &&
    !!steps.DATES_AND_PENALTIES &&
    !!steps.DEPOSIT_PAYMENT &&
    !!steps.RENT_PAYMENT &&
    !!steps.TENANT_APPROVE

  result.date = steps.TENANT_INFORMATION

  result.link = result.completed ? null : `/contracts/${contractId}/manage`
  result.status = result.completed ? 'تکمیل' : 'ثبت ناقص'

  return result
}

const generateTenantSignStep = ({ contractId, statuses, steps }) => {
  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'امضای مستاجر',
  }

  if (!steps.LANDLORD_INFORMATION || !steps.LANDLORD_SIGNATURE) {
    return result
  }

  const isTenant = statuses.current_user_party_type === prContractPartyTypeEnum.TENANT

  result.date = steps.TENANT_SIGNATURE
  result.completed = !!steps.TENANT_SIGNATURE
  result.status = result.completed ? 'تکمیل' : ''

  if (!steps.TENANT_SIGNATURE) {
    result.status = `در انتظار امضای ${isTenant ? 'شما' : 'مستاجر'}`
    result.link = isTenant ? `/contracts/${contractId}/manage/draft` : null
  }

  return result
}

const generateOwnerAndSignStep = ({ statuses, steps, contractId }) => {
  const isLandlord = statuses.current_user_party_type === prContractPartyTypeEnum.LANDLORD
  const isStartByTenant = statuses.owner_party_type === prContractPartyTypeEnum.TENANT

  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'تکمیل اطلاعات و امضای مالک',
  }

  if (
    isStartByTenant &&
    (!steps.TENANT_INFORMATION ||
      !steps.ADD_COUNTER_PARTY ||
      !steps.DATES_AND_PENALTIES ||
      !steps.DEPOSIT_PAYMENT ||
      !steps.RENT_PAYMENT ||
      !steps.TENANT_APPROVE)
  ) {
    return result
  }

  result.date = steps.LANDLORD_INFORMATION || steps.LANDLORD_SIGNATURE
  result.completed = !!steps.LANDLORD_INFORMATION && !!steps.LANDLORD_SIGNATURE
  result.status = result.completed ? 'تکمیل' : ''

  if (
    !steps.LANDLORD_INFORMATION ||
    !steps.PROPERTY_DETAILS ||
    !steps.PROPERTY_FACILITIES ||
    !steps.PROPERTY_SPECIFICATIONS ||
    !steps.DATES_AND_PENALTIES ||
    !steps.DEPOSIT_PAYMENT ||
    !steps.RENT_PAYMENT
  ) {
    result.status = `در انتظار تکمیل اطلاعات و امضای ${isLandlord ? 'شما' : 'مالک'}`
    result.link = isLandlord ? `/contracts/${contractId}/manage` : null
  } else if (!steps.LANDLORD_SIGNATURE) {
    result.status = `در انتظار امضای ${isLandlord ? 'شما' : 'مالک'}`
    result.link = isLandlord ? `/contracts/${contractId}/manage/draft` : null
  }

  return result
}

const generateTenantAndSignStep = ({ contractId, statuses, steps }) => {
  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'تکمیل اطلاعات و امضای مستاجر',
  }

  const isTenant = statuses.current_user_party_type === prContractPartyTypeEnum.TENANT

  if (!steps.LANDLORD_INFORMATION || !steps.LANDLORD_SIGNATURE) {
    return result
  }

  result.date = steps.TENANT_INFORMATION || steps.TENANT_SIGNATURE
  result.completed = !!steps.TENANT_INFORMATION && !!steps.TENANT_SIGNATURE
  result.status = result.completed ? 'تکمیل' : ''

  if (!steps.TENANT_INFORMATION) {
    result.status = `در انتظار تکمیل اطلاعات و امضای ${isTenant ? 'شما' : 'مستاجر'}`
    result.link = isTenant ? `/contracts/${contractId}/manage` : null
  } else if (!steps.TENANT_SIGNATURE) {
    result.status = `در انتظار امضای ${isTenant ? 'شما' : 'مستاجر'}`
    result.link = isTenant ? `/contracts/${contractId}/manage/draft` : null
  }

  return result
}

const generateCommissionStep = ({ contractId, statuses, steps }) => {
  const isLandlord = statuses.current_user_party_type === prContractPartyTypeEnum.LANDLORD
  const isTenant = statuses.current_user_party_type === prContractPartyTypeEnum.TENANT

  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'پرداخت کمیسیون مالک و مستاجر',
  }

  if (
    !steps.LANDLORD_INFORMATION ||
    !steps.LANDLORD_SIGNATURE ||
    !steps.TENANT_INFORMATION ||
    !steps.TENANT_SIGNATURE
  ) {
    return result
  }

  if (steps.TENANT_COMMISSION && steps.LANDLORD_COMMISSION) {
    result.status = 'تکمیل'
    result.completed = true
    result.date = steps.TENANT_COMMISSION || steps.LANDLORD_COMMISSION
  } else if ((isLandlord && !steps.LANDLORD_COMMISSION) || (isTenant && !steps.TENANT_COMMISSION)) {
    result.status = `در انتظار پرداخت کمیسیون شما`
    result.link = `/contracts/${contractId}/invoice`
  } else {
    result.status = `در انتظار پرداخت کمیسیون ${!steps.TENANT_COMMISSION ? 'مستاجر' : 'مالک'}`
  }

  return result
}

const generateConfirmationStep = ({ steps }) => {
  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'تایید کارشناس حقوقی املاین',
  }

  if (
    !steps.LANDLORD_INFORMATION ||
    !steps.LANDLORD_SIGNATURE ||
    !steps.TENANT_INFORMATION ||
    !steps.TENANT_SIGNATURE ||
    !steps.TENANT_COMMISSION ||
    !steps.LANDLORD_COMMISSION
  ) {
    return result
  }

  if (steps.ADMIN_REJECT) {
    result.error = true
    result.status = 'اجاره نامه توسط کارشناس رد شد'
    result.date = steps.adminRejectedAt
  } else if (steps.ADMIN_APPROVE) {
    result.completed = true
    result.status = 'تکمیل'
    result.date = steps.ADMIN_APPROVE
  } else {
    result.status = 'در انتظار تایید کارشناس'
  }

  return result
}

const generateTrackingStep = ({ steps }) => {
  const result = {
    date: null,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'صدور کد رهگیری و مشاهده قرارداد',
  }

  if (!steps.ADMIN_APPROVE) {
    return result
  }

  if (steps.TRACKING_CODE_DELIVERED) {
    result.status = 'تکمیل'
    result.completed = true
    result.date = steps.TRACKING_CODE_DELIVERED
  } else if (steps.TRACKING_CODE_FAILED) {
    result.error = true
    result.status = 'عدم صدور کد رهگیری'
  } else {
    result.status = 'در انتظار صدور کد رهگیری'
  }

  return result
}

const generateTenantRejectedStep = ({ statuses, steps }) => {
  const result = {
    date: steps.TENANT_REJECTED,
    link: null,
    error: true,
    status: '',
    completed: false,
    label: 'تکمیل اطلاعات و امضای مستاجر',
  }

  const isTenant = statuses.current_user_party_type === prContractPartyTypeEnum.TENANT
  result.status = `اجاره نامه توسط ${isTenant ? 'شما' : 'مستاجر'} رد شد`

  return result
}

const generateLandlordRejectedStep = ({ statuses, steps }) => {
  const result = {
    date: steps.LANDLORD_REJECTED,
    link: null,
    error: true,
    status: '',
    completed: false,
    label: 'تکمیل اطلاعات و امضای مالک',
  }

  const isLandlord = statuses.current_user_party_type === prContractPartyTypeEnum.LANDLORD
  result.status = `اجاره نامه توسط ${isLandlord ? 'شما' : 'مالک'} رد شد`

  return result
}

const generateTenantEditRequestStep = ({ statuses, steps }) => {
  const result = {
    date: steps.TENANT_EDIT_REQUEST,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'ویرایش اطلاعات و امضای مالک',
  }

  const isLandlord = statuses.current_user_party_type === prContractPartyTypeEnum.LANDLORD
  result.status = `درخواست ویرایش اطلاعات از طرف ${isLandlord ? 'مستاجر' : 'شما'}`

  return result
}

const generateLandlordEditRequestStep = ({ statuses, steps }) => {
  const result = {
    date: steps.LANDLORD_EDIT_REQUEST,
    link: null,
    error: false,
    status: '',
    completed: false,
    label: 'ویرایش اطلاعات و امضای مستاجر',
  }

  const isLandlord = statuses.current_user_party_type === prContractPartyTypeEnum.LANDLORD
  result.status = `درخواست ویرایش اطلاعات از طرف ${isLandlord ? 'شما' : 'مالک'}`

  return result
}

const generateRentalIndividualProcesses = (statuses, contractId) => {
  const results = []
  const { steps } = statuses

  const params = {
    statuses,
    contractId,
    steps,
  }

  if (statuses.owner_party_type === prContractPartyTypeEnum.LANDLORD) {
    results.push(generateOwnerAndSignStep(params))

    if (steps.TENANT_REJECTED) {
      results.push(generateTenantRejectedStep(params))
    } else if (steps.TENANT_EDIT_REQUEST) {
      results.push(generateTenantEditRequestStep(params))
    } else {
      results.push(generateTenantAndSignStep(params))
      results.push(generateCommissionStep(params))
      results.push(generateConfirmationStep(params))
      results.push(generateTrackingStep(params))
    }
  } else {
    results.push(generateTenantStep(params))

    if (steps.LANDLORD_REJECTED) {
      results.push(generateLandlordRejectedStep(params))
    } else if (steps.LANDLORD_EDIT_REQUEST) {
      results.push(generateLandlordEditRequestStep(params))
    } else {
      results.push(generateOwnerAndSignStep(params))
      results.push(generateTenantSignStep(params))
      results.push(generateCommissionStep(params))
      results.push(generateConfirmationStep(params))
      results.push(generateTrackingStep(params))
    }
  }

  return results
}

const getPrContractProcesses = ({ contractType, statuses, contractId }) => {
  const categoryStepGenerators = {
    [contractTypeEnum.PROPERTY_RENT]: generateRentalIndividualProcesses,
  }

  const generator = categoryStepGenerators[contractType]

  if (!generator) return []

  return generator(statuses, contractId)
}

export { getPrContractProcesses }
