from account.domain.enums import UserRole
from advertisement.domain.entities.property_ad import (
    PropertyAd,
    set_ad_category_based_on_property_type,
)
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import CreatePropertyAdDto
from core.types import CurrentUser
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


def create_property_ad_handler(command: CreatePropertyAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        is_admin = True if UserRole.SUPERUSER in current_user.roles else False
        command_dict = command.dumps()
        property_info: dict = command_dict.get("property_info")  # type: ignore
        if image_file_ids := property_info.get("image_file_ids"):
            property_info["image_file_ids"] = [i for i in image_file_ids if i is not None]
        property = Property.create(
            owner_user_id=current_user.id,
            owner_user_role=current_user.roles[0],
            city_id=command.city_id,
            **property_info,
        )
        command_dict.pop("property_info")
        property_ad = PropertyAd.create(
            user_id=current_user.id,
            property_id=property.id,
            created_by=current_user.id,
            created_by_admin=is_admin,
            status=AdStatus.PENDING,
            category=set_ad_category_based_on_property_type(property_info["property_type"]),
            **command_dict,
        )
        uow.properties.add(property)
        uow.flush()
        uow.property_ads.add(property_ad)
        uow.commit()
        uow.property_ads.refresh(property_ad)
        return property_ad.dumps()
