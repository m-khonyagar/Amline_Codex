from datetime import UTC, datetime

from advertisement.domain.enums import AdStatus
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def reject_ad_handler(property_ad_id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        property_ad = uow.property_ads.get_or_raise(id=property_ad_id)
        property_ad.status = AdStatus.REJECTED
        property_ad.rejected_at = datetime.now(UTC)
        uow.commit()
