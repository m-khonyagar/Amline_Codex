import {
  CalendarIcon,
  CashIcon,
  ChequeIcon,
  CircleBigCheckIcon,
  CircleCloseIcon,
  CircleLoadingIcon,
} from '@/components/icons'

const contractSidesEnum = {
  FIRST_SIDE: 1,
  SECOND_SIDE: 2,
}

const contractPartyTypeEnum = {
  INDIVIDUAL: 1,
  LEGAL: 2,
}

const paymentMethodEnum = {
  CHEQUE: 'CHEQUE',
  CASH: 'CASH',
}
const paymentMethodEnumTranslation = {
  [paymentMethodEnum.CHEQUE]: 'چک',
  [paymentMethodEnum.CASH]: 'نقد',
}

const paymentFormTypeEnum = {
  CHEQUE: 'CHEQUE',
  CASH: 'CASH',
  MONTHLY: 'MONTHLY',
}

const contractPartyTypeOptions = [
  {
    value: contractPartyTypeEnum.INDIVIDUAL,
    label: 'خودم',
  },
  {
    value: contractPartyTypeEnum.LEGAL,
    label: 'شخص حقوقی',
    disabled: true,
  },
]

const paymentFormTypeOptions = [
  {
    paymentMethod: paymentMethodEnum.CASH,
    value: paymentFormTypeEnum.MONTHLY,
    label: 'ماهانه',
    icon: CalendarIcon,
  },
  {
    paymentMethod: paymentMethodEnum.CHEQUE,
    value: paymentFormTypeEnum.CHEQUE,
    label: 'چک',
    icon: ChequeIcon,
  },
  {
    paymentMethod: paymentMethodEnum.CASH,
    value: paymentFormTypeEnum.CASH,
    label: 'نقد',
    icon: CashIcon,
  },
]

const prContractPartyTypeEnum = {
  LANDLORD: 'LANDLORD',
  TENANT: 'TENANT',
}
const prContractPartyTypeOptions = [
  {
    value: prContractPartyTypeEnum.LANDLORD,
    label: 'مالک',
  },
  {
    value: prContractPartyTypeEnum.TENANT,
    label: 'مستاجر',
  },
]

const contractStatusEnum = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PENDING_COMMISSION: 'PENDING_COMMISSION',
  PENDING_ADMIN_APPROVAL: 'PENDING_ADMIN_APPROVAL',
  ADMIN_APPROVED: 'ADMIN_APPROVED',
  ADMIN_REJECTED: 'ADMIN_REJECTED',
  EDIT_REQUESTED: 'EDIT_REQUESTED',
  COMPLETED: 'COMPLETED',
  REVOKED: 'REVOKED',
  PARTY_REJECTED: 'PARTY_REJECTED',
  PDF_GENERATED: 'PDF_GENERATED',
  PDF_GENERATING_FAILED: 'PDF_GENERATING_FAILED',
}

const statusTypeEnum = {
  SUCCESS: {
    color: '#1ABC34',
    icon: CircleBigCheckIcon,
  },
  DANGER: {
    color: '#F53D3D',
    icon: CircleCloseIcon,
  },
  WARNING: {
    color: '#FF9900',
    icon: CircleLoadingIcon,
  },
  DEFAULT: {
    color: '#F53D3D',
    icon: CircleLoadingIcon,
  },
}

const contractTypeEnum = {
  PROPERTY_RENT: 'PROPERTY_RENT',
  PROPERTY_SALE: 'PROPERTY_SALE',
}
const contractTypeEnumOptions = [
  {
    value: contractTypeEnum.PROPERTY_RENT,
    label: 'رهن و اجاره',
  },
  {
    value: contractTypeEnum.PROPERTY_SALE,
    label: 'خرید و فروش',
    disabled: true,
  },
]

const personTypeEnumOptions = [
  {
    value: 'INDIVIDUAL',
    label: 'شخص حقیقی',
  },
  {
    value: 'LEGAL_ENTITY',
    label: 'شخص حقوقی',
  },
  {
    value: 'FOREIGN_NATIONALS',
    label: 'اتباع',
  },
]

const ChequeCategoryEnumOptions = [
  {
    value: 'SALARY',
    label: 'واریز حقوق',
  },
  {
    value: 'INSURANCE',
    label: 'امور بیمه خدمات',
  },
  {
    value: 'HEALTH_CARE',
    label: 'امور درمانی',
  },
  {
    value: 'INVESTMENT',
    label: 'امور سرمایه گذاری و بورس',
  },
  {
    value: 'FOREIGN_EXCHANGE',
    label: 'امور ارزی در چارچوب ضوابط و مقررات',
  },
  {
    value: 'LOAN',
    label: 'پرداخت قرض و تادیه دیوان (قرض الحسنه, بدهی )',
  },
  {
    value: 'RETIREMENT',
    label: 'امور بازنشستگی',
  },
  {
    value: 'MOVABLE_PROPERTY',
    label: 'معاملات اموال منقول',
  },
  {
    value: 'IMMOVABLE_PROPERTY',
    label: 'معاملات اموال غیر منقول',
  },
  {
    value: 'CASH_MANAGEMENT',
    label: 'مدیریت نقدینگی',
  },
  {
    value: 'CUSTOMS_DUTIES',
    label: 'عوارض گمرکی',
  },
  {
    value: 'TAX_DUTIES',
    label: 'تسویه مالیاتی',
  },
  {
    value: 'GOVERNMENTAL_SERVICES',
    label: 'سایر خدمات دولتی',
  },
  {
    value: 'FACILITIES',
    label: 'تسهیلات و تعهدات',
  },
  {
    value: 'BAIL_DEPOSIT',
    label: 'تودیع وثیقه',
  },
  {
    value: 'DAILY_EXPENSES',
    label: 'هزینه عمومی و امور روزمره',
  },
  {
    value: 'CHARITY',
    label: 'کمک های خیریه',
  },
  {
    value: 'GOODS_PURCHASE',
    label: 'خرید کالا',
  },
  {
    value: 'SERVICES_PURCHASE',
    label: 'خرید خدمات',
  },
]

const bankGatewayEnums = {
  ZARINPAL: 'ZARINPAL',
  PARSIAN: 'PARSIAN',
}

const prContractPaymentTypeEnum = {
  DEPOSIT: 'DEPOSIT',
  RENT: 'RENT',
}

export {
  contractSidesEnum,
  paymentMethodEnum,
  paymentFormTypeEnum,
  paymentFormTypeOptions,
  contractPartyTypeEnum,
  contractTypeEnumOptions,
  contractPartyTypeOptions,
  prContractPartyTypeEnum,
  prContractPartyTypeOptions,
  contractStatusEnum,
  contractTypeEnum,
  personTypeEnumOptions,
  ChequeCategoryEnumOptions,
  bankGatewayEnums,
  prContractPaymentTypeEnum,
  paymentMethodEnumTranslation,
  statusTypeEnum,
}
