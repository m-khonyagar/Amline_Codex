from account.domain.entities.user import User
from core.helpers import remove_user_objects
from core.types import PaginateParams
from unit_of_work import UnitOfWork


def get_swap_ads(user: User | None, params: PaginateParams, uow: UnitOfWork):
    with uow:
        saved_ads_ids = {ad.ad_id: True for ad in uow.user_saved_ads.get_user_saved_ads(user.id) or []} if user else {}

        swap_ads = uow.swap_ads.find_all_published(params)
        swap_ads = remove_user_objects(swap_ads)
        return [swp.dumps(is_saved=saved_ads_ids.get(swp.id, False)) for swp in swap_ads] if swap_ads else []
