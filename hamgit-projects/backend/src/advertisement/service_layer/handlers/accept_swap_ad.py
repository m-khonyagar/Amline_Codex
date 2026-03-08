from advertisement.domain.enums import AdStatus
from core.helpers import get_now
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def accept_swap_ad_handler(swap_ad_id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        swap_ad = uow.swap_ads.get_or_raise(id=swap_ad_id)
        swap_ad.accepted_at = get_now()
        swap_ad.status = AdStatus.PUBLISHED
        swap_ad.accepted_by = current_user.id
        uow.commit()
        uow.swap_ads.refresh(swap_ad)
        return swap_ad.dumps()
