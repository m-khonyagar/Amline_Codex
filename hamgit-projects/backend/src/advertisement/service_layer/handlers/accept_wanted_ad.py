from advertisement.domain.enums import AdStatus
from core.helpers import get_now
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def accept_wanted_ad_handler(property_wanted_ad_id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        property_wanted_ad = uow.property_wanted_ads.get_or_raise(id=property_wanted_ad_id)
        property_wanted_ad.accepted_at = get_now()
        property_wanted_ad.status = AdStatus.PUBLISHED
        property_wanted_ad.accepted_by = current_user.id
        uow.commit()
        uow.property_wanted_ads.refresh(property_wanted_ad)
        return property_wanted_ad.dumps()
