from enum import Enum

from core.base.base_enum import BaseEnum


class UserRole(BaseEnum):
    SUPERUSER = "SUPERUSER"
    STAFF = "STAFF"
    PERSON = "PERSON"
    ORGANIZATION = "ORGANIZATION"
    AD_MODERATOR = "AD_MODERATOR"
    CONTRACT_ADMIN = "CONTRACT_ADMIN"
    AUDITOR = "AUDITOR"
    EMPTY_CONTRACT_CREATOR = "EMPTY_CONTRACT_CREATOR"


class RoleAccess(Enum):
    SUPERUSER = ["SUPERUSER"]
    STAFF = ["SUPERUSER", "STAFF"]
    AD_MODERATOR = ["SUPERUSER", "AD_MODERATOR"]
    CONTRACT_ADMIN = ["SUPERUSER", "STAFF", "CONTRACT_ADMIN"]
    EMPTY_CONTRACT_CREATOR = ["SUPERUSER", "EMPTY_CONTRACT_CREATOR"]


class TokenType(BaseEnum):
    ACCESS = "ACCESS"
    REFRESH = "REFRESH"


class Gender(BaseEnum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    LEGAL = "LEGAL"


class UserCallStatus(BaseEnum):
    RED = "RED"
    ORANGE = "ORANGE"
    GREEN = "GREEN"


class UserCallType(BaseEnum):
    INCOMING = "INCOMING"
    OUTGOING = "OUTGOING"


class UserTextSender(BaseEnum):
    SMS = "SMS"
    DING = "DING"
