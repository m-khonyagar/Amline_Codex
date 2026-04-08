from datetime import date
from typing import Any, List

from advertisement.domain.enums import AdStatus, AdType
from core.base.base_response_model import BaseResponse
from shared.domain.enums import PropertyType


class PropertyWantedAdResponseModel(BaseResponse):
    id: str
    type: AdType
    title: str | None
    user_id: str
    nick_name: str | None
    mobile: str | None
    city_id: str
    districts_list: List | None = []
    property_type: List[PropertyType]
    status: AdStatus
    description: str | None = None
    min_size: int | None = None
    room_count: int | None
    tenant_deadline: date | None = None
    created_by_admin: bool
    elevator: bool | None = None
    parking: bool | None = None
    storage_room: bool | None = None
    max_deposit: int | None = None
    max_rent: int | None = None
    sale_price: int | None = None
    construction_year: int | str | None = None
    accepted_at: str | None = None


class PropertyAdResponseModel(BaseResponse):
    id: str
    type: AdType
    title: str | None
    user_id: str | None
    city_id: str | None
    district_id: str | None
    property_id: str | None
    image_file_ids: List[str] | None
    location: dict | None
    status: AdStatus
    description: str | None = None
    district: Any = None
    property: dict | None = {}
    images: List[dict] | None = []


class SwapAdResponseModel(BaseResponse):
    id: str
    user_id: str
    title: str
    have: str
    want: str
    price: int
    status: str
    created_by_admin: bool


class VisitRequestResponseModel(BaseResponse):
    id: str
    status: str
    visit_date: str | None
    description: str | None
    requester_mobile: str
    requester_user_id: str
    owner_mobile: str
    owner_user_id: str
    advertisement_id: str
    created_at: str
    accepted_at: str | None
    rejected_at: str | None
    property_ad: dict | None
