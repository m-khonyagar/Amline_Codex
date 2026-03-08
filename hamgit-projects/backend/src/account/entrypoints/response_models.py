import datetime as dt

from pydantic import BaseModel

from account.domain.enums import Gender, UserRole


class UserSavedAdResponse(BaseModel):
    id: str
    user_id: str
    ad_id: str
    ad_type: str
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None


class UserResponse(BaseModel):
    id: str
    mobile: str
    is_active: bool
    first_name: str | None
    last_name: str | None
    father_name: str | None
    birth_date: dt.date | None
    national_code: str | None
    gender: Gender | None
    nick_name: str | None
    postal_code: str | None
    email: str | None
    address: str | None
    avatar_file: dict | None = None
    is_verified: bool | None
    last_login: dt.datetime | None
    roles: list[UserRole]


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str


class BankAccountResponse(BaseModel):
    id: str
    user_id: str
    user_role: UserRole
    iban: str
    owner_name: str
    bank_name: str | None
    branch_name: str | None
    card_number: str | None
    account_number: str | None
