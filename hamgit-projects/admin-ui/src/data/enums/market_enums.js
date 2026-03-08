const MarketRole = {
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  REALTOR: 'realtor',
  BUYER: 'buyer',
  SELLER: 'seller',
}

const MarketRoleLabels = {
  landlord: 'مالک',
  tenant: 'مستاجر',
  realtor: 'مشاور املاک',
  buyer: 'خریدار',
  seller: 'فروشنده',
}

const MarketRoles = {
  DEPOSIT_RENT: [MarketRole.LANDLORD, MarketRole.TENANT],
  BUY_SELL: [MarketRole.BUYER, MarketRole.SELLER],
  REALTOR: MarketRole.REALTOR,
}

const FileStatusEnum = {
  FILE_CREATED: 'FILE_CREATED',
  INFO_COMPLETED: 'INFO_COMPLETED',
  AD_REGISTERED: 'AD_REGISTERED',
  FILE_SEARCH: 'FILE_SEARCH',
  NEGOTIATION: 'NEGOTIATION',
  VISIT: 'VISIT',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED',
}

const FileStatusLabels = {
  FILE_CREATED: 'ثبت لید',
  INFO_COMPLETED: 'تکمیل اطلاعات',
  AD_REGISTERED: 'ثبت آگهی',
  FILE_SEARCH: 'تطبیق',
  NEGOTIATION: 'مذاکره',
  VISIT: 'بازدید',
  CONTRACT_SIGNED: 'قرارداد',
  CANCELLED: 'انصراف',
  ARCHIVED: 'بایگانی',
}

const FileStatusOptions = [
  { label: FileStatusLabels.FILE_CREATED, value: FileStatusEnum.FILE_CREATED },
  { label: FileStatusLabels.INFO_COMPLETED, value: FileStatusEnum.INFO_COMPLETED },
  { label: FileStatusLabels.AD_REGISTERED, value: FileStatusEnum.AD_REGISTERED },
  { label: FileStatusLabels.FILE_SEARCH, value: FileStatusEnum.FILE_SEARCH },
  { label: FileStatusLabels.NEGOTIATION, value: FileStatusEnum.NEGOTIATION },
  { label: FileStatusLabels.VISIT, value: FileStatusEnum.VISIT },
  { label: FileStatusLabels.CONTRACT_SIGNED, value: FileStatusEnum.CONTRACT_SIGNED },
  { label: FileStatusLabels.CANCELLED, value: FileStatusEnum.CANCELLED },
  { label: FileStatusLabels.ARCHIVED, value: FileStatusEnum.ARCHIVED },
]

const CallStatusEnum = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  INPUT_CALL: 'INPUT_CALL',
}

const CallStatusLabels = {
  SUCCESS: 'موفق',
  FAILED: 'ناموفق',
  INPUT_CALL: 'ورودی',
}

const CallStatusOptions = [
  { label: CallStatusLabels.SUCCESS, value: CallStatusEnum.SUCCESS, variant: 'success' },
  { label: CallStatusLabels.FAILED, value: CallStatusEnum.FAILED, variant: 'danger' },
  { label: CallStatusLabels.INPUT_CALL, value: CallStatusEnum.INPUT_CALL, variant: 'gray' },
]

const FileConnectionStatusEnum = {
  DRAFT: 'DRAFT',
  APPROVED_FOR_VISIT: 'APPROVED_FOR_VISIT',
  REJECTED: 'REJECTED',
  SUCCESSFUL: 'SUCCESSFUL',
  LANDLORD_DID_NOT_ANSWER: 'LANDLORD_DID_NOT_ANSWER',
  TENANT_DID_NOT_ANSWER: 'TENANT_DID_NOT_ANSWER',
}

const FileConnectionStatusLabels = {
  DRAFT: 'تعیین وضعیت نشده',
  APPROVED_FOR_VISIT: 'تایید برای بازدید',
  REJECTED: 'رد شده',
  SUCCESSFUL: 'بازدید موفق',
  LANDLORD_DID_NOT_ANSWER: 'موجر پاسخ نداد',
  TENANT_DID_NOT_ANSWER: 'مستاجر پاسخ نداد',
}

const FileConnectionStatusOptions = [
  {
    label: FileConnectionStatusLabels.DRAFT,
    value: FileConnectionStatusEnum.DRAFT,
    variant: 'outline',
  },
  {
    label: FileConnectionStatusLabels.APPROVED_FOR_VISIT,
    value: FileConnectionStatusEnum.APPROVED_FOR_VISIT,
    variant: 'success',
  },
  {
    label: FileConnectionStatusLabels.REJECTED,
    value: FileConnectionStatusEnum.REJECTED,
    variant: 'danger',
  },
  {
    label: FileConnectionStatusLabels.SUCCESSFUL,
    value: FileConnectionStatusEnum.SUCCESSFUL,
    variant: 'success',
  },

  {
    label: FileConnectionStatusLabels.LANDLORD_DID_NOT_ANSWER,
    value: FileConnectionStatusEnum.LANDLORD_DID_NOT_ANSWER,
    variant: 'danger',
  },
  {
    label: FileConnectionStatusLabels.TENANT_DID_NOT_ANSWER,
    value: FileConnectionStatusEnum.TENANT_DID_NOT_ANSWER,
    variant: 'danger',
  },
]

const SpecializationEnum = {
  RENT: 'RENT',
  SALE: 'SALE',
  PARTNERSHIP: 'PARTNERSHIP',
}

const SpecializationLabels = {
  RENT: 'رهن و اجاره',
  SALE: 'خرید و فروش',
  PARTNERSHIP: 'همکاری',
}

const SpecializationOptions = [
  { label: SpecializationLabels.RENT, value: SpecializationEnum.RENT },
  { label: SpecializationLabels.SALE, value: SpecializationEnum.SALE },
  { label: SpecializationLabels.PARTNERSHIP, value: SpecializationEnum.PARTNERSHIP },
]

const MonopolyEnum = {
  MONOPOLY: 'MONOPOLY',
  MONOPOLY_EXISTS: 'MONOPOLY_EXISTS',
  NO_MONOPOLY: 'NO_MONOPOLY',
  NO_COOPERATION: 'NO_COOPERATION',
}

const MonopolyLabels = {
  MONOPOLY: 'مونوپول شد',
  MONOPOLY_EXISTS: 'مونوپول هست',
  NO_MONOPOLY: 'مونوپول نیست (آگاهی حذف نمی کند)',
  NO_COOPERATION: 'مونوپول نیست و همکاری هم نمی کند',
}

const MonopolyOptions = [
  { label: MonopolyLabels.MONOPOLY, value: MonopolyEnum.MONOPOLY },
  { label: MonopolyLabels.MONOPOLY_EXISTS, value: MonopolyEnum.MONOPOLY_EXISTS },
  { label: MonopolyLabels.NO_MONOPOLY, value: MonopolyEnum.NO_MONOPOLY },
  { label: MonopolyLabels.NO_COOPERATION, value: MonopolyEnum.NO_COOPERATION },
]

const TaskStatusEnum = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
}

const TaskStatusLabels = {
  TODO: 'در صف انجام',
  IN_PROGRESS: 'در حال پیگیری',
  DONE: 'انجام شده',
}

const TaskStatusOptions = [
  { label: TaskStatusLabels.TODO, value: TaskStatusEnum.TODO },
  { label: TaskStatusLabels.IN_PROGRESS, value: TaskStatusEnum.IN_PROGRESS },
  { label: TaskStatusLabels.DONE, value: TaskStatusEnum.DONE },
]

const PhoneExportTypeEnum = {
  USER: 'USER',
  LANDLORD_FILE: 'LANDLORD_FILE',
  ARCHIVED_LANDLORD_FILE: 'ARCHIVED_LANDLORD_FILE',
  TENANT_FILE: 'TENANT_FILE',
  ARCHIVED_TENANT_FILE: 'ARCHIVED_TENANT_FILE',
  REALTOR_FILE: 'REALTOR_FILE',
}

export {
  MarketRole,
  MarketRoleLabels,
  MarketRoles,
  FileStatusEnum,
  FileStatusLabels,
  FileStatusOptions,
  CallStatusEnum,
  CallStatusLabels,
  CallStatusOptions,
  FileConnectionStatusEnum,
  FileConnectionStatusLabels,
  FileConnectionStatusOptions,
  SpecializationEnum,
  SpecializationLabels,
  SpecializationOptions,
  MonopolyEnum,
  MonopolyLabels,
  MonopolyOptions,
  TaskStatusEnum,
  TaskStatusLabels,
  TaskStatusOptions,
  PhoneExportTypeEnum,
}
