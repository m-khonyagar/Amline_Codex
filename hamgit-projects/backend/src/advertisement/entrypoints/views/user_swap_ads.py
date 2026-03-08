from core.types import FilterCriteria, PaginateParams
from unit_of_work import UnitOfWork


def get_user_swap_ads(user_id: int, params: PaginateParams, uow: UnitOfWork):

    with uow:
        filters = []
        filters.append(FilterCriteria(field_names={"user_id"}, value=user_id))
        _, swap_ads = uow.swap_ads.get_all(params, filters)  # type: ignore
        return [swap_wanted_ad.dumps() for swap_wanted_ad in swap_ads] if swap_ads else []
