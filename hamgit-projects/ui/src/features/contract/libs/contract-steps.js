import { dateAndPaymentSteps } from './date-payment-steps'
import { propertyInformationSteps } from './property-steps'
import { contractSidesEnum, contractTypeEnum, prContractPartyTypeEnum } from '../constants'

const ownerStep = {
  title: 'اطلاعات مالک',
  link: 'owner-data',
  disabled: false,
  completed: false,
  readOnly: false,
  sideEnumId: contractSidesEnum.FIRST_SIDE,
  partyType: prContractPartyTypeEnum.LANDLORD,
  checkCompleted: (item) => {
    const isLandlord = item.current_user_party_type === prContractPartyTypeEnum.LANDLORD
    return isLandlord ? item.steps.LANDLORD_INFORMATION : item.steps.ADD_COUNTER_PARTY
  },
}

const renterStep = {
  title: 'اطلاعات مستاجر',
  link: 'renter-data',
  disabled: false,
  completed: false,
  readOnly: false,
  sideEnumId: contractSidesEnum.SECOND_SIDE,
  partyType: prContractPartyTypeEnum.TENANT,
  checkCompleted: (item) => {
    const isTenant = item.current_user_party_type === prContractPartyTypeEnum.TENANT
    return isTenant ? item.steps.TENANT_INFORMATION : item.steps.ADD_COUNTER_PARTY
  },
}

const propertyInformationStep = {
  title: 'اطلاعات ملک اجاره ای',
  link: 'property-information',
  disabled: false,
  completed: false,
  readOnly: false,
  checkCompleted: (contract) => propertyInformationSteps.every((s) => s.checkCompleted(contract)),
}

const paymentStep = {
  title: 'تاریخ و پرداخت',
  link: 'date-payment',
  disabled: false,
  completed: false,
  readOnly: false,
  checkCompleted: (contract) => dateAndPaymentSteps.every((s) => s.checkCompleted(contract)),
}

const draftStep = {
  title: 'پیش نویس اجاره نامه',
  link: 'draft',
  disabled: true,
  completed: false,
  readOnly: false,
}

const generateRentalIndividualSteps = (statuses) => {
  const ownerPartyType = statuses.owner_party_type
  const currentUserPartyType = statuses.current_user_party_type

  const collections = [
    {
      ownerPartyType: prContractPartyTypeEnum.LANDLORD,
      currentUserPartyType: prContractPartyTypeEnum.LANDLORD,
      steps: [ownerStep, renterStep, propertyInformationStep, paymentStep, draftStep],
    },
    {
      ownerPartyType: prContractPartyTypeEnum.LANDLORD,
      currentUserPartyType: prContractPartyTypeEnum.TENANT,
      steps: [
        {
          ...ownerStep,
          disabled: true,
          title: `${ownerStep.title} - (توسط مالک)`,
        },
        renterStep,
        {
          ...propertyInformationStep,
          disabled: true,
          title: `${propertyInformationStep.title} - (توسط مالک)`,
        },
        { ...paymentStep, disabled: true, title: `${paymentStep.title} - (توسط مالک)` },
        draftStep,
      ],
    },
    {
      ownerPartyType: prContractPartyTypeEnum.TENANT,
      currentUserPartyType: prContractPartyTypeEnum.TENANT,
      steps: [
        renterStep,
        ownerStep,
        {
          ...propertyInformationStep,
          disabled: true,
          title: `${propertyInformationStep.title} - (توسط مالک)`,
        },
        paymentStep,
        draftStep,
      ],
    },
    {
      ownerPartyType: prContractPartyTypeEnum.TENANT,
      currentUserPartyType: prContractPartyTypeEnum.LANDLORD,
      steps: [
        { ...renterStep, disabled: true },
        { ...ownerStep, readOnly: true },
        propertyInformationStep,
        { ...paymentStep, disabled: true },
        draftStep,
      ],
    },
  ]

  const collection = collections.find(
    (c) => c.ownerPartyType === ownerPartyType && c.currentUserPartyType === currentUserPartyType
  )

  if (!collection) {
    return []
  }

  return collection.steps.map((step) => ({
    ...step,
    completed: step.checkCompleted ? step.checkCompleted(statuses, step) : step.completed,
  }))
}

const getContractSteps = ({ contractType, statuses, contractId }) => {
  const categoryStepGenerators = {
    [contractTypeEnum.PROPERTY_RENT]: generateRentalIndividualSteps,
  }

  const generator = categoryStepGenerators[contractType]

  if (!generator) return []

  return generator(statuses, contractId)
}

export { getContractSteps }
