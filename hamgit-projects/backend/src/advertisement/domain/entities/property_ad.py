from datetime import UTC, datetime
from typing import no_type_check

import pytz

from account.domain.entities.user import User
from advertisement.domain.enums import AdStatus, AdType, PropertyAdCategory
from core.base.base_entity import BaseEntity
from shared.domain.entities.city import City
from shared.domain.entities.district import District
from shared.domain.entities.property import Property
from shared.domain.enums import PropertyType


class PropertyAd(BaseEntity):
    id: int
    type: AdType
    category: PropertyAdCategory
    title: str
    user_id: int
    city_id: int
    district_id: int
    property_id: int
    location: dict
    image_file_ids: list[int]
    status: AdStatus
    description: str
    created_by_admin: bool
    # ----------------rent------------------#
    deposit_amount: int | None
    rent_amount: int | None
    dynamic_amounts: bool | None
    # ----------------sale------------------#
    sale_price: int | None
    # --------------------------------------#
    created_by: int
    accepted_by: int | None
    accepted_at: datetime | None
    rejected_at: datetime | None
    created_at: datetime | None
    updated_at: datetime | None
    deleted_at: datetime | None

    is_reported: bool = False
    report_description: str | None

    user: User | dict = {}
    city: City | dict = {}
    district: District | dict = {}
    property: Property | dict = {}
    images: list = []

    @no_type_check
    def __init__(
        self,
        type: AdType,
        title: str,
        user_id: int,
        city_id: int,
        district_id: int,
        property_id: int,
        image_file_ids: list[int],
        location: dict,
        status: AdStatus | None = None,
        description: str | None = None,
        created_by_admin: bool | None = None,
        deposit_amount: int | None = None,
        rent_amount: int | None = None,
        sale_price: int | None = None,
        created_by: int | None = None,
        accepted_by: int | None = None,
        accepted_at: datetime | None = None,
        rejected_at: datetime | None = None,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
        deleted_at: datetime | None = None,
        is_reported: bool = False,
        report_description: str | None = None,
        dynamic_amounts: bool | None = False,
        category: PropertyAdCategory | None = None,
        user: User | dict = {},
        city: City | dict = {},
        district: District | dict = {},
        property: Property | dict = {},
        images: list = [],
        id: int | None = None,
    ):
        self.type = type
        self.title = title
        self.user_id = user_id
        self.city_id = city_id
        self.district_id = district_id
        self.location = location
        self.property_id = property_id
        self.image_file_ids = image_file_ids
        self.status = status
        self.description = description
        self.created_by_admin = created_by_admin
        self.deposit_amount = deposit_amount
        self.rent_amount = rent_amount
        self.sale_price = sale_price
        self.created_by = created_by
        self.accepted_by = accepted_by
        self.accepted_at = accepted_at
        self.rejected_at = rejected_at
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at
        self.user = user
        self.city = city
        self.district = district
        self.property = property
        self.dynamic_amounts = dynamic_amounts
        self.category = category
        self.is_reported = is_reported
        self.report_description = report_description
        self.images = images
        if id:
            self.id = id

    @no_type_check
    @classmethod
    def create(
        cls,
        type: AdType,
        category: PropertyAdCategory,
        title: str,
        user_id: int,
        city_id: int,
        district_id: int,
        property_id: int,
        location: dict,
        deposit_amount: int | None,
        rent_amount: int | None,
        sale_price: int | None,
        image_file_ids: list[int],
        description: str,
        created_by: int,
        created_by_admin: bool,
        dynamic_amounts: bool,
        status: AdStatus | None = None,
    ):
        return cls(
            type=type,
            title=title,
            category=category,
            user_id=user_id,
            city_id=city_id,
            district_id=district_id,
            location=location,
            property_id=property_id,
            deposit_amount=deposit_amount,
            rent_amount=rent_amount,
            sale_price=sale_price,
            image_file_ids=image_file_ids,
            status=status or AdStatus.PENDING,
            description=description,
            created_by=created_by,
            accepted_by=None,
            accepted_at=None,
            rejected_at=None,
            created_by_admin=created_by_admin,
            created_at=datetime.now(UTC),
            deleted_at=None,
            dynamic_amounts=dynamic_amounts,
        )

    def update(self, command: dict, created_by: int, created_by_admin: bool):
        self.title = command.get("title", self.title)
        self.city_id = command.get("city_id", self.city_id)
        self.district_id = command.get("district_id", self.district_id)
        self.location = command.get("location", self.location)
        self.property_id = command.get("property_id", self.property_id)
        self.image_file_ids = command.get("image_file_ids", self.image_file_ids)
        self.status = command.get("status", self.status)
        self.description = command.get("description", self.description)
        self.deposit_amount = command.get("deposit_amount", self.deposit_amount)
        self.rent_amount = command.get("rent_amount", self.rent_amount)
        self.sale_price = command.get("sale_price", self.sale_price)
        self.dynamic_amounts = command.get("dynamic_amounts", self.dynamic_amounts)
        self.category = command.get("category", self.category)
        self.created_by = created_by
        self.created_by_admin = created_by_admin
        self.updated_at = datetime.now(UTC)

    def soft_delete(self):
        self.deleted_at = datetime.now(UTC)

    def dumps(self, **kwargs) -> dict:
        images: list = []
        if "images" in kwargs.keys():
            images = kwargs.get("images", [])  # type:ignore
            kwargs.pop("images")

        return dict(
            id=str(self.id),
            type=self.type,
            category=self.category,
            title=self.title,
            user_id=str(self.user_id),
            city_id=str(self.city_id),
            district_id=str(self.district_id),
            location=self.location,
            property_id=str(self.property_id),
            image_file_ids=(
                [str(image_id) for image_id in self.image_file_ids] if self.image_file_ids is not None else []
            ),
            status=self.status,
            description=self.description,
            created_by_admin=self.created_by_admin,
            deposit_amount=self.deposit_amount,
            rent_amount=self.rent_amount,
            sale_price=self.sale_price,
            dynamic_amounts=self.dynamic_amounts,
            user=self.user.dumps() if isinstance(self.user, User) else self.enrich_data(self.user),
            city=self.city.dumps() if isinstance(self.city, City) else self.city,
            district=self.district.dumps() if isinstance(self.district, District) else self.district,
            property=self.property.dumps() if isinstance(self.property, Property) else self.enrich_data(self.property),
            accepted_at=(
                (self.accepted_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if (isinstance(self.accepted_at, datetime))
                else None
            ),
            rejected_at=(
                (self.rejected_at.astimezone(pytz.timezone("Asia/Tehran"))).strftime("%Y-%m-%d %H:%M:%S")
                if (isinstance(self.rejected_at, datetime))
                else None
            ),
            images=self.images or images,
            **kwargs,
        )

    def enrich_data(self, data: dict[str, dict]):
        if data:
            k = list(data.keys())[0]
            nested_object = data[k]
            if isinstance(nested_object, dict):
                return {k: (str(v) if "id" in k else v) for k, v in nested_object.items()}
            else:
                return data


def set_ad_category_based_on_property_type(property_type: PropertyType) -> PropertyAdCategory:
    for category_value in PropertyAdCategory.__members__:
        if category_value in property_type.value:
            return PropertyAdCategory(category_value)

    return PropertyAdCategory("OTHERS")
