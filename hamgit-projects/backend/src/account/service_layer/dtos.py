import datetime as dt
from dataclasses import dataclass

from account.domain.enums import Gender, UserRole
from advertisement.domain.enums import AdCategory
from core.base.base_dto import BaseDto


@dataclass
class SendAuthenticationOtpDto(BaseDto):
    mobile: str


@dataclass
class VerifyAuthenticationOtpDto(BaseDto):
    mobile: str
    otp: str


@dataclass
class AdminLoginDto(BaseDto):
    mobile: str
    national_code: str


@dataclass
class RefreshAccessTokenDto(BaseDto):
    refresh_token: str


@dataclass
class UpdateUserDto(BaseDto):
    first_name: str | None = None
    last_name: str | None = None
    father_name: str | None = None
    birth_date: dt.date | None = None
    national_code: str | None = None
    gender: Gender | None = None
    nick_name: str | None = None
    postal_code: str | None = None
    email: str | None = None
    address: str | None = None
    avatar_file_id: int | None = None
    default_city_id: int | None = None


@dataclass
class UpdateNicknameDto(BaseDto):
    nick_name: str


@dataclass
class CreateSavedAdDto(BaseDto):
    ad_id: int
    ad_type: AdCategory


@dataclass
class CreateBankAccountDto(BaseDto):
    iban: str
    owner_name: str
    user_role: UserRole
    bank_name: str | None = None
    branch_name: str | None = None
    card_number: str | None = None
    account_number: str | None = None


@dataclass
class VerifyUserInformationDto(BaseDto):
    mobile: str
    national_code: str | None = None
    birth_date: dt.date | None = None
    without_verifying: bool = False


@dataclass
class CreateUserDto(BaseDto):
    mobile: str
    roles: list[UserRole]
    is_verified: bool | None = None
    national_code: str | None = None
    birth_date: dt.date | None = None
    last_name: str | None = None
    first_name: str | None = None
    father_name: str | None = None
    postal_code: str | None = None
    address: str | None = None
    verify_identity: bool = False
    label_ids: list[int] | None = None


@dataclass
class UserAuthDto(BaseDto):
    id: int
    mobile: str
    is_admin: bool
