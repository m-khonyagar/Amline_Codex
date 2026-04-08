from datetime import UTC, datetime

from advertisement.domain.enums import AdStatus
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def reject_swap_ad_handler(swap_ad_id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        swap_ad = uow.swap_ads.get_or_raise(id=swap_ad_id)
        swap_ad.status = AdStatus.REJECTED
        swap_ad.rejected_at = datetime.now(UTC)
        uow.commit()
        uow.swap_ads.refresh(swap_ad)
        return swap_ad.dumps()
