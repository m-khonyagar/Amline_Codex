from datetime import date

from pydantic import BaseModel, Field

from account.domain.enums import UserCallStatus, UserCallType, UserTextSender
from crm.domain.enums import RealtorType


class UserCallCreateRequest(BaseModel):
    user_id: int
    description: str
    status: UserCallStatus
    type: UserCallType


class UserTextCreateRequest(BaseModel):
    user_id: int
    text: str
    sender: UserTextSender

    class Config:
        use_enum_values = True


class RealtorRegisterRequest(BaseModel):
    mobile: str = Field(..., pattern=r"^09[0-9]{9}$")
    national_code: str
    birth_date: date
    address: str
    city_id: int
    district_ids: list[int]
    office_name: str | None
    realtor_type: RealtorType
    avatar_file_id: int
