from typing import Dict

from account.domain.enums import UserRole
from advertisement.domain.entities.property_ad import (
    set_ad_category_based_on_property_type,
)
from advertisement.domain.enums import AdStatus, AdType
from advertisement.service_layer.dtos import UpdatePropertyAdDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def update_property_ad_handler(command: UpdatePropertyAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        is_admin = True if UserRole.SUPERUSER in current_user.roles else False
        command_dict = command.dumps()
        property_info: Dict = command_dict.get("property_info", {})
        property_info_dict = {k: v for k, v in property_info.items() if v is not None}

        property_ad = uow.property_ads.get_or_raise(id=command.property_ad_id)
        property = property_ad.property

        property.update(**property_info_dict)

        command_dict.pop("property_info")

        if property_ad.type == AdType.FOR_RENT:
            command.sale_price = None
        else:
            command.rent_amount = command.deposit_amount = None

        command_dict["category"] = set_ad_category_based_on_property_type(property_info_dict["property_type"])
        property_ad.update(command_dict, created_by=current_user.id, created_by_admin=is_admin)
        if not is_admin:
            property_ad.status = AdStatus.PENDING

        uow.commit()
        uow.property_ads.refresh(property_ad)
        return property_ad.dumps()
