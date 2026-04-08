from account.domain.entities.user import User
from advertisement.service_layer.services.similar_ad_matcher_service import (
    AdMatcherService,
)
from unit_of_work import UnitOfWork


def get_similar_property_wanted_ads(user: User | None, id: int, uow: UnitOfWork):

    with uow:
        saved_ads_ids = {ad.ad_id: True for ad in uow.user_saved_ads.get_user_saved_ads(user.id) or []} if user else {}

        property_wanted_ads = AdMatcherService.find_similar_wanted_ads(id, uow)
        # property_wanted_ads = remove_user_objects(property_wanted_ads)
        return (
            [pwa.dumps(is_saved=saved_ads_ids.get(pwa.id, False)) for pwa in property_wanted_ads]
            if property_wanted_ads
            else []
        )
