from account.domain.entities.user import User
from advertisement.entrypoints.request_models import GetWantedAdFilter
from core.types import PaginateParams
from unit_of_work import UnitOfWork


def get_property_wanted_ads(user: User | None, params: PaginateParams, filters: GetWantedAdFilter, uow: UnitOfWork):

    with uow:
        saved_ads_ids = {ad.ad_id: True for ad in uow.user_saved_ads.get_user_saved_ads(user.id) or []} if user else {}

        property_wanted_ads = uow.property_wanted_ads.find_all_property_wanted_ads(filters, params)
        # property_wanted_ads = remove_user_objects(property_wanted_ads)
        return (
            [pwd.dumps(is_saved=saved_ads_ids.get(pwd.id, False)) for pwd in property_wanted_ads]
            if property_wanted_ads
            else []
        )
