const userGender = { MALE: 'MALE', FEMALE: 'FEMALE', LEGAL: 'LEGAL' }

const userGenderTranslation = { MALE: 'مذکر', FEMALE: 'مونث', LEGAL: 'حقوقی' }

const userGenderOptions = [
  { value: userGender.MALE, label: userGenderTranslation.MALE },
  { value: userGender.FEMALE, label: userGenderTranslation.FEMALE },
  { value: userGender.LEGAL, label: userGenderTranslation.LEGAL },
]

const userRoles = [
  'PERSON',
  'STAFF',
  'AD_MODERATOR',
  'CONTRACT_ADMIN',
  'AUDITOR',
  'EMPTY_CONTRACT_CREATOR',
  'SUPERUSER',
]

const userRolesTranslation = {
  PERSON: 'کاربر عادی',
  STAFF: 'کارمند',
  AD_MODERATOR: 'بازار',
  CONTRACT_ADMIN: 'مشاور املاک',
  AUDITOR: 'بازرس',
  EMPTY_CONTRACT_CREATOR: 'دسترسی کد رهگیری',
  SUPERUSER: 'مدیر ارشد',
}

const userRolesOptions = [
  { value: 'PERSON', label: userRolesTranslation.PERSON },
  { value: 'STAFF', label: userRolesTranslation.STAFF },
  { value: 'AD_MODERATOR', label: userRolesTranslation.AD_MODERATOR },
  { value: 'CONTRACT_ADMIN', label: userRolesTranslation.CONTRACT_ADMIN },
  { value: 'AUDITOR', label: userRolesTranslation.AUDITOR },
  { value: 'EMPTY_CONTRACT_CREATOR', label: userRolesTranslation.EMPTY_CONTRACT_CREATOR },
  { value: 'SUPERUSER', label: userRolesTranslation.SUPERUSER },
]

const userCallStatusEnum = [
  { label: 'نیازمند رسیدگی فوری', value: 'RED', color: 'bg-red-300', bg: '!bg-red-50' },
  { label: 'پاسخ نداد', value: 'ORANGE', color: 'bg-orange-300', bg: '!bg-orange-50' },
  { label: 'بدون مشکل', value: 'GREEN', color: 'bg-green-300', bg: '!bg-green-50' },
]

const userCallTypeEnum = [
  { label: 'ورودی', value: 'INCOMING' },
  { label: 'خروجی', value: 'OUTGOING' },
]

export {
  userGender,
  userGenderTranslation,
  userGenderOptions,
  userRoles,
  userRolesTranslation,
  userRolesOptions,
  userCallStatusEnum,
  userCallTypeEnum,
}
