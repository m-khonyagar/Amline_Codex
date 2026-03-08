export const statusTypeEnum = {
  SUCCESS: {
    color: '#1ABC34',
    variant: 'success',
  },
  DANGER: {
    color: '#F53D3D',
    variant: 'danger',
  },
  WARNING: {
    color: '#FF9900',
    variant: 'warning',
  },
  DEFAULT: {
    color: '#15aabf',
    variant: 'outline',
  },
}

// contract type
export const contractType = { PROPERTY_RENT: 'PROPERTY_RENT' }

export const contractTypeOptions = [{ value: contractType.PROPERTY_RENT, label: 'رهن و اجاره' }]

// party type
export const partyType = { LANDLORD: 'LANDLORD', TENANT: 'TENANT' }

export const partyTypeOptions = [
  { value: partyType.LANDLORD, label: 'مالک' },
  { value: partyType.TENANT, label: 'مستاجر' },
]

// contract status
export const contractStatus = {
  ADMIN_STARTED: 'ADMIN_STARTED',
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

export const contractStatusOptions = [
  {
    value: contractStatus.ADMIN_STARTED,
    label: 'شروع شده توسط مدیر',
    type: statusTypeEnum.DEFAULT,
  },
  { value: contractStatus.DRAFT, label: 'پیش‌نویس', type: statusTypeEnum.DEFAULT },
  { value: contractStatus.ACTIVE, label: 'فعال', type: statusTypeEnum.DEFAULT },
  {
    value: contractStatus.PENDING_COMMISSION,
    label: 'در انتظار کمیسیون',
    type: statusTypeEnum.WARNING,
  },
  {
    value: contractStatus.PENDING_ADMIN_APPROVAL,
    label: 'در انتظار تایید مدیر',
    type: statusTypeEnum.WARNING,
  },
  {
    value: contractStatus.ADMIN_APPROVED,
    label: 'تایید شده توسط مدیر',
    type: statusTypeEnum.SUCCESS,
  },
  { value: contractStatus.ADMIN_REJECTED, label: 'رد شده توسط مدیر', type: statusTypeEnum.WARNING },
  { value: contractStatus.EDIT_REQUESTED, label: 'درخواست ویرایش', type: statusTypeEnum.WARNING },
  { value: contractStatus.COMPLETED, label: 'تکمیل شده', type: statusTypeEnum.SUCCESS },
  { value: contractStatus.REVOKED, label: 'لغو شده', type: statusTypeEnum.DANGER },
  { value: contractStatus.PARTY_REJECTED, label: 'رد شده توسط طرف', type: statusTypeEnum.DANGER },
  {
    value: contractStatus.PDF_GENERATED,
    label: 'ایجاد فایل قرارداد',
    type: statusTypeEnum.SUCCESS,
  },
  {
    value: contractStatus.PDF_GENERATING_FAILED,
    label: 'خطا در ایحاد فایل قرارداد',
    type: statusTypeEnum.WARNING,
  },
]

// contract state
export const PRContractState = {
  DRAFT: 'DRAFT',
  LANDLORD_REJECTED: 'LANDLORD_REJECTED',
  TENANT_REJECTED: 'TENANT_REJECTED',
  ADMIN_REJECTED: 'ADMIN_REJECTED',
  PENDING_TENANT_APPROVAL: 'PENDING_TENANT_APPROVAL',
  PENDING_LANDLORD_SIGNATURE: 'PENDING_LANDLORD_SIGNATURE',
  PENDING_TENANT_INFORMATION: 'PENDING_TENANT_INFORMATION',
  PENDING_TENANT_SIGNATURE: 'PENDING_TENANT_SIGNATURE',
  PENDING_PAYING_COMMISSION: 'PENDING_PAYING_COMMISSION',
  PENDING_LANDLORD_COMMISSION: 'PENDING_LANDLORD_COMMISSION',
  PENDING_LANDLORD_INFORMATION: 'PENDING_LANDLORD_INFORMATION',
  PENDING_TENANT_COMMISSION: 'PENDING_TENANT_COMMISSION',
  PENDING_ADMIN_APPROVAL: 'PENDING_ADMIN_APPROVAL',
  PENDING_TRACKING_CODE_REQUEST: 'PENDING_TRACKING_CODE_REQUEST',
  PENDING_TRACKING_CODE_DELIVERY: 'PENDING_TRACKING_CODE_DELIVERY',
  TRACKING_CODE_DELIVERED: 'TRACKING_CODE_DELIVERED',
}

export const PRContractStateOptions = [
  { value: PRContractState.DRAFT, label: 'پیش‌نویس' },
  { value: PRContractState.LANDLORD_REJECTED, label: 'رد شده توسط مالک' },
  { value: PRContractState.TENANT_REJECTED, label: 'رد شده توسط مستاجر' },
  { value: PRContractState.ADMIN_REJECTED, label: 'رد شده توسط مدیر' },
  { value: PRContractState.PENDING_TENANT_APPROVAL, label: 'در انتظار تایید مستاجر' },
  { value: PRContractState.PENDING_LANDLORD_SIGNATURE, label: 'در انتظار امضای مالک' },
  { value: PRContractState.PENDING_TENANT_INFORMATION, label: 'در انتظار اطلاعات مستاجر' },
  { value: PRContractState.PENDING_TENANT_SIGNATURE, label: 'در انتظار امضای مستاجر' },
  { value: PRContractState.PENDING_PAYING_COMMISSION, label: 'در انتظار پرداخت کمیسیون' },
  { value: PRContractState.PENDING_LANDLORD_COMMISSION, label: 'در انتظار کمیسیون مالک' },
  { value: PRContractState.PENDING_LANDLORD_INFORMATION, label: 'در انتظار اطلاعات مالک' },
  { value: PRContractState.PENDING_TENANT_COMMISSION, label: 'در انتظار کمیسیون مستاجر' },
  { value: PRContractState.PENDING_ADMIN_APPROVAL, label: 'در انتظار تایید مدیر' },
  { value: PRContractState.PENDING_TRACKING_CODE_REQUEST, label: 'در انتظار درخواست کد پیگیری' },
  { value: PRContractState.PENDING_TRACKING_CODE_DELIVERY, label: 'در انتظار تحویل کد پیگیری' },
  { value: PRContractState.TRACKING_CODE_DELIVERED, label: 'کد پیگیری تحویل داده شد' },
]

// tracking code status
export const TrackingCodeStatus = {
  NOT_GENERATED: 'NOT_GENERATED',
  REQUESTED: 'REQUESTED',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
}

export const TrackingCodeStatusOptions = [
  { value: TrackingCodeStatus.NOT_GENERATED, label: 'در انتظار صدور کد رهگیری' },
  { value: TrackingCodeStatus.REQUESTED, label: 'درخواست صدور کد رهگیری' },
  { value: TrackingCodeStatus.DELIVERED, label: 'صادر شده' },
  { value: TrackingCodeStatus.FAILED, label: 'ناموفق' },
]

export const bankAccountType = { RENT: 'RENT', DEPOSIT: 'DEPOSIT' }

export const bankAccountTypeOptions = [
  { value: bankAccountType.RENT, label: 'اجاره' },
  { value: bankAccountType.DEPOSIT, label: 'رهن' },
]

// Payment Method
export const paymentMethod = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
}

export const paymentMethodLabels = {
  [paymentMethod.CASH]: 'نقدی',
  [paymentMethod.CHEQUE]: 'چک',
  BOTH: 'ترکیبی',
}

export const paymentMethodOptions = [
  { value: paymentMethod.CASH, label: paymentMethodLabels.CASH },
  { value: paymentMethod.CHEQUE, label: paymentMethodLabels.CHEQUE },
]

// Payment Status
export const paymentStatus = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
  PAYER_CLAIMED_TO_HAVE_PAID: 'PAYER_CLAIMED_TO_HAVE_PAID',
  PAYEE_CONFIRMED_RECEIPT: 'PAYEE_CONFIRMED_RECEIPT',
  PAYEE_DENIED_RECEIPT: 'PAYEE_DENIED_RECEIPT',
}

export const paymentStatusOptions = [
  { value: paymentStatus.PAID, label: 'پرداخت شده' },
  { value: paymentStatus.UNPAID, label: 'پرداخت نشده' },
  { value: paymentStatus.OVERDUE, label: 'معوق' },
  { value: paymentStatus.CANCELLED, label: 'لغو شده' },
  { value: paymentStatus.PAYER_CLAIMED_TO_HAVE_PAID, label: 'پرداخت توسط پرداخت کننده ادعا شده' },
  { value: paymentStatus.PAYEE_CONFIRMED_RECEIPT, label: 'دریافت توسط دریافت کننده تایید شده' },
  { value: paymentStatus.PAYEE_DENIED_RECEIPT, label: 'دریافت توسط دریافت کننده رد شده' },
]

// Payment Type
export const paymentType = {
  DEPOSIT: 'DEPOSIT',
  RENT: 'RENT',
  COMMISSION: 'COMMISSION',
  PENALTY: 'PENALTY',
  OTHER: 'OTHER',
}

export const paymentTypeOptions = [
  { value: paymentType.DEPOSIT, label: 'رهن', color: 'teal' },
  { value: paymentType.RENT, label: 'اجاره', color: 'rust' },
  { value: paymentType.COMMISSION, label: 'کمیسیون', color: 'oragne' },
  { value: paymentType.PENALTY, label: 'جریمه' },
  { value: paymentType.OTHER, label: 'سایر' },
]

// Cheque Category
export const chequeCategory = {
  SALARY: 'SALARY',
  INSURANCE: 'INSURANCE',
  HEALTH_CARE: 'HEALTH_CARE',
  INVESTMENT: 'INVESTMENT',
  FOREIGN_EXCHANGE: 'FOREIGN_EXCHANGE',
  LOAN: 'LOAN',
  RETIREMENT: 'RETIREMENT',
  MOVABLE_PROPERTY: 'MOVABLE_PROPERTY',
  IMMOVABLE_PROPERTY: 'IMMOVABLE_PROPERTY',
  CASH_MANAGEMENT: 'CASH_MANAGEMENT',
  CUSTOMS_DUTIES: 'CUSTOMS_DUTIES',
  TAX_DUTIES: 'TAX_DUTIES',
  GOVERNMENTAL_SERVICES: 'GOVERNMENTAL_SERVICES',
  FACILITIES: 'FACILITIES',
  BAIL_DEPOSIT: 'BAIL_DEPOSIT',
  DAILY_EXPENSES: 'DAILY_EXPENSES',
  CHARITY: 'CHARITY',
  GOODS_PURCHASE: 'GOODS_PURCHASE',
  SERVICES_PURCHASE: 'SERVICES_PURCHASE',
}

export const chequeCategoryOptions = [
  { value: chequeCategory.SALARY, label: 'حقوق' },
  { value: chequeCategory.INSURANCE, label: 'بیمه' },
  { value: chequeCategory.HEALTH_CARE, label: 'مراقبت های بهداشتی' },
  { value: chequeCategory.INVESTMENT, label: 'سرمایه گذاری' },
  { value: chequeCategory.FOREIGN_EXCHANGE, label: 'ارز خارجی' },
  { value: chequeCategory.LOAN, label: 'وام' },
  { value: chequeCategory.RETIREMENT, label: 'بازنشستگی' },
  { value: chequeCategory.MOVABLE_PROPERTY, label: 'اموال منقول' },
  { value: chequeCategory.IMMOVABLE_PROPERTY, label: 'اموال غیر منقول' },
  { value: chequeCategory.CASH_MANAGEMENT, label: 'مدیریت نقدی' },
  { value: chequeCategory.CUSTOMS_DUTIES, label: 'عوارض گمرکی' },
  { value: chequeCategory.TAX_DUTIES, label: 'عوارض مالیاتی' },
  { value: chequeCategory.GOVERNMENTAL_SERVICES, label: 'خدمات دولتی' },
  { value: chequeCategory.FACILITIES, label: 'تسهیلات' },
  { value: chequeCategory.BAIL_DEPOSIT, label: 'رهن وثیقه' },
  { value: chequeCategory.DAILY_EXPENSES, label: 'هزینه های روزانه' },
  { value: chequeCategory.CHARITY, label: 'خیریه' },
  { value: chequeCategory.GOODS_PURCHASE, label: 'خرید کالا' },
  { value: chequeCategory.SERVICES_PURCHASE, label: 'خرید خدمات' },
]

// Cheque Payee Type
export const chequePayeeType = {
  INDIVIDUAL: 'INDIVIDUAL',
  LEGAL_ENTITY: 'LEGAL_ENTITY',
  FOREIGN_NATIONALS: 'FOREIGN_NATIONALS',
}

export const chequePayeeTypeOptions = [
  { value: chequePayeeType.INDIVIDUAL, label: 'شخص حقیقی' },
  { value: chequePayeeType.LEGAL_ENTITY, label: 'شخص حقوقی' },
  { value: chequePayeeType.FOREIGN_NATIONALS, label: 'اتباع خارجی' },
]

// Contract Color
export const contractColor = {
  RED: 'RED',
  GREEN: 'GREEN',
  PURPLE: 'PURPLE',
}

export const contractColorOptions = [
  { value: contractColor.RED, label: 'قرمز' },
  { value: contractColor.GREEN, label: 'سبز' },
  { value: contractColor.PURPLE, label: 'بنفش' },
  { value: null, label: 'بدون رنگ' },
]

// Cheque Status
export const chequeStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
}

export const chequeStatusOptions = [
  { value: chequeStatus.PENDING, label: 'در انتظار' },
  { value: chequeStatus.APPROVED, label: 'تایید شده' },
  { value: chequeStatus.REJECTED, label: 'رد شده' },
  { value: chequeStatus.CANCELLED, label: 'لغو شده' },
]

// Contract Step
export const PRContractStep = {
  DATES_AND_PENALTIES: 'DATES_AND_PENALTIES',
  MONTHLY_RENT: 'MONTHLY_RENT',
  RENT_PAYMENT: 'RENT_PAYMENT',
  DEPOSIT: 'DEPOSIT',
  ADD_COUNTER_PARTY: 'ADD_COUNTER_PARTY',
  DEPOSIT_PAYMENT: 'DEPOSIT_PAYMENT',
  TENANT_INFORMATION: 'TENANT_INFORMATION',
  TENANT_APPROVE: 'TENANT_APPROVE',
  TENANT_SIGNATURE: 'TENANT_SIGNATURE',
  TENANT_COMMISSION: 'TENANT_COMMISSION',
  TENANT_REJECTED: 'TENANT_REJECTED',
  TENANT_EDIT_REQUEST: 'TENANT_EDIT_REQUEST',
  LANDLORD_INFORMATION: 'LANDLORD_INFORMATION',
  PROPERTY_SPECIFICATIONS: 'PROPERTY_SPECIFICATIONS',
  PROPERTY_DETAILS: 'PROPERTY_DETAILS',
  PROPERTY_FACILITIES: 'PROPERTY_FACILITIES',
  LANDLORD_SIGNATURE: 'LANDLORD_SIGNATURE',
  LANDLORD_COMMISSION: 'LANDLORD_COMMISSION',
  LANDLORD_REJECTED: 'LANDLORD_REJECTED',
  LANDLORD_EDIT_REQUEST: 'LANDLORD_EDIT_REQUEST',
  ADMIN_APPROVE: 'ADMIN_APPROVE',
  ADMIN_REJECT: 'ADMIN_REJECT',
  TRACKING_CODE_REQUESTED: 'TRACKING_CODE_REQUESTED',
  TRACKING_CODE_DELIVERED: 'TRACKING_CODE_DELIVERED',
  TRACKING_CODE_FAILED: 'TRACKING_CODE_FAILED',
}

export const PRContractStepOptions = [
  { value: PRContractStep.DATES_AND_PENALTIES, label: 'تاریخ‌ها و جریمه‌ها' },
  { value: PRContractStep.MONTHLY_RENT, label: 'اجاره ماهانه' },
  { value: PRContractStep.RENT_PAYMENT, label: 'پرداخت اجاره' },
  { value: PRContractStep.DEPOSIT, label: 'رهن' },
  { value: PRContractStep.ADD_COUNTER_PARTY, label: 'افزودن طرف مقابل' },
  { value: PRContractStep.DEPOSIT_PAYMENT, label: 'پرداخت رهن' },
  { value: PRContractStep.TENANT_INFORMATION, label: 'اطلاعات مستاجر' },
  { value: PRContractStep.TENANT_APPROVE, label: 'تایید مستاجر' },
  { value: PRContractStep.TENANT_SIGNATURE, label: 'امضای مستاجر' },
  { value: PRContractStep.TENANT_COMMISSION, label: 'کمیسیون مستاجر' },
  { value: PRContractStep.TENANT_REJECTED, label: 'رد مستاجر' },
  { value: PRContractStep.TENANT_EDIT_REQUEST, label: 'درخواست ویرایش مستاجر' },
  { value: PRContractStep.LANDLORD_INFORMATION, label: 'اطلاعات مالک' },
  { value: PRContractStep.PROPERTY_SPECIFICATIONS, label: 'مشخصات ملک' },
  { value: PRContractStep.PROPERTY_DETAILS, label: 'جزئیات ملک' },
  { value: PRContractStep.PROPERTY_FACILITIES, label: 'امکانات ملک' },
  { value: PRContractStep.LANDLORD_SIGNATURE, label: 'امضای مالک' },
  { value: PRContractStep.LANDLORD_COMMISSION, label: 'کمیسیون مالک' },
  { value: PRContractStep.LANDLORD_REJECTED, label: 'رد مالک' },
  { value: PRContractStep.LANDLORD_EDIT_REQUEST, label: 'درخواست ویرایش مالک' },
  { value: PRContractStep.ADMIN_APPROVE, label: 'تایید مدیر' },
  { value: PRContractStep.ADMIN_REJECT, label: 'رد مدیر' },
  { value: PRContractStep.TRACKING_CODE_REQUESTED, label: 'درخواست کد پیگیری' },
  { value: PRContractStep.TRACKING_CODE_DELIVERED, label: 'تحویل کد پیگیری' },
  { value: PRContractStep.TRACKING_CODE_FAILED, label: 'خطا در کد پیگیری' },
]
