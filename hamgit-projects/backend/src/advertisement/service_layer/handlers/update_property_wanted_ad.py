from advertisement.domain.enums import AdStatus, AdType
from advertisement.service_layer.dtos import UpdatePropertyWantedAdDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def update_property_wanted_ad_handler(command: UpdatePropertyWantedAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        is_admin = current_user.is_admin
        property_wanted_ad = uow.property_wanted_ads.get_or_raise(id=command.property_wanted_ad_id)
        if property_wanted_ad.type == AdType.FOR_RENT:
            command.sale_price = command.construction_year = None
        else:
            command.max_rent = command.max_deposit = None

        property_wanted_ad.update(command, created_by=current_user.id, created_by_admin=is_admin)
        if not is_admin:
            property_wanted_ad.status = AdStatus.PENDING

        uow.commit()
        uow.property_wanted_ads.refresh(property_wanted_ad)
        return property_wanted_ad.dumps()
