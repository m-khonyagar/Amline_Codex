from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.enums import AdStatus
from advertisement.service_layer.dtos import CreatePropertyWantedAdDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_property_wanted_ad_handler(command: CreatePropertyWantedAdDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        is_admin = current_user.is_admin
        property_wanted_ad = PropertyWantedAd.create(
            user_id=current_user.id,
            created_by=current_user.id,
            created_by_admin=is_admin,
            status=AdStatus.PENDING,
            **command.dumps(),
        )
        uow.property_wanted_ads.add(property_wanted_ad)
        uow.commit()
        return property_wanted_ad.dumps()
