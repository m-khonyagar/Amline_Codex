from core.base.base_enum import BaseEnum


class FileStatus(BaseEnum):
    FILE_CREATED = "FILE_CREATED"  # ثبت لید
    INFO_COMPLETED = "INFO_COMPLETED"  # ثبت و تکمیل اطلاعات
    AD_REGISTERED = "AD_REGISTERED"  # ثبت آگهی
    FILE_SEARCH = "FILE_SEARCH"  # جستجوی فایل
    NEGOTIATION = "NEGOTIATION"  # مذاکره
    VISIT = "VISIT"  # بازدید
    CONTRACT_SIGNED = "CONTRACT_SIGNED"  # انعقاد قرارداد
    CANCELLED = "CANCELLED"  # انصراف
    ARCHIVED = "ARCHIVED"  # ارشیو شده


class FileType(BaseEnum):
    LANDLORD = "landlord_files"
    TENANT = "tenant_files"
    REALTOR = "realtor_files"


class TaskStatus(BaseEnum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class CallStatus(BaseEnum):
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    INPUT_CALL = "INPUT_CALL"


class RealtorSharedFileStatus(BaseEnum):
    SENT = "SENT"
    FAILED = "FAILED"


class FileConnectionStatus(BaseEnum):
    DRAFT = "DRAFT"  # تعیین وضعیت نشده
    APPROVED_FOR_VISIT = "APPROVED_FOR_VISIT"  # تایید برای بازدید
    REJECTED = "REJECTED"  # رد شده
    SUCCESSFUL = "SUCCESSFUL"  # موفق
    LANDLORD_DID_NOT_ANSWER = "LANDLORD_DID_NOT_ANSWER"  # موجر پاسخ نداد
    TENANT_DID_NOT_ANSWER = "TENANT_DID_NOT_ANSWER"  # مستاجر پاسخ نداد


class FileConnectionInitiator(BaseEnum):
    LANDLORD = "LANDLORD"
    TENANT = "TENANT"


class Specialization(BaseEnum):
    RENT = "RENT"
    SALE = "SALE"
    PARTNERSHIP = "PARTNERSHIP"


class MonopolyStatus(BaseEnum):
    MONOPOLY = "MONOPOLY"  # مونوپولی
    MONOPOLY_EXISTS = "MONOPOLY_EXISTS"  # مونوپولی وجود دارد
    NO_MONOPOLY = "NO_MONOPOLY"  # بدون مونوپولی
    NO_COOPERATION = "NO_COOPERATION"  # بدون همکاری


class RealtorSharedFileSendType(BaseEnum):
    SMS = "SMS"
    DING = "DING"


class ReportDuration(BaseEnum):
    MONTHLY = "MONTHLY"
    WEEKLY = "WEEKLY"
    DAILY = "DAILY"


class PhonesEntityType(BaseEnum):
    USER = "USER"
    LANDLORD_FILE = "LANDLORD_FILE"
    ARCHIVED_LANDLORD_FILE = "ARCHIVED_LANDLORD_FILE"
    TENANT_FILE = "TENANT_FILE"
    ARCHIVED_TENANT_FILE = "ARCHIVED_TENANT_FILE"
    REALTOR_FILE = "REALTOR_FILE"


class SalePaymentMethod(BaseEnum):
    CASH = "CASH"
    CHEQUE = "CHEQUE"
    BOTH = "BOTH"


class ListingType(BaseEnum):
    SALE = "SALE"
    RENT = "RENT"


class LabelType(BaseEnum):
    USER = "USER"
    FILE = "FILE"


class RealtorType(BaseEnum):
    LICENSE_HOLDER = "LICENSE_HOLDER"  # صاحب پروانه
    INDEPENDENT_CONSULTANT = "INDEPENDENT_CONSULTANT"  # مشاور آزاد
    EMPLOYED_AT_FIRM = "EMPLOYED_AT_FIRM"  # مشغول در دفتر
