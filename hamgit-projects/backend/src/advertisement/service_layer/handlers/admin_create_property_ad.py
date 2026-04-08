from account.domain.entities.user import User
from advertisement.domain.entities.property_ad import (
    PropertyAd,
    set_ad_category_based_on_property_type,
)
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import CreateAdminPropertyAdDto
from core.types import CurrentUser
from shared.domain.entities.property import Property
from unit_of_work import UnitOfWork


def create_admin_property_ad_handler(command: CreateAdminPropertyAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        user = uow.users.get(mobile=command.mobile)
        if not user:
            user = User(mobile=command.mobile)
            uow.users.add(user)

        command_dict = command.dumps()
        property_info: dict = command_dict.get("property_info")  # type: ignore
        command_dict.pop("property_info")
        if image_file_ids := property_info.get("image_file_ids"):
            property_info["image_file_ids"] = [i for i in image_file_ids if i is not None]
        property = Property.create(
            owner_user_id=user.id,
            owner_user_role=user.roles[0],
            city_id=command.city_id,
            **property_info,
        )
        command_dict.pop("mobile")

        property_ad = PropertyAd.create(
            user_id=user.id,
            property_id=property.id,
            created_by=current_user.id,
            created_by_admin=True,
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
