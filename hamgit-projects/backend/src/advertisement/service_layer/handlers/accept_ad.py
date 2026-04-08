from advertisement.domain.enums import AdStatus
from core.helpers import get_now
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def accept_ad_handler(property_ad_id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        property_ad = uow.property_ads.get_or_raise(id=property_ad_id)
        property_ad.accepted_at = get_now()
        property_ad.status = AdStatus.PUBLISHED
        property_ad.accepted_by = current_user.id
        uow.commit()
