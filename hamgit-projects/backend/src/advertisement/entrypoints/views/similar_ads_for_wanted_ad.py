from account.domain.entities.user import User
from advertisement.service_layer.services.similar_ad_matcher_service import (
    AdMatcherService,
)
from core.helpers import remove_user_objects
from unit_of_work import UnitOfWork


def get_similar_ads_for_wanted_ad(user: User | None, wanted_id: int, uow: UnitOfWork):

    with uow:
        saved_ads_ids = {ad.ad_id: True for ad in uow.user_saved_ads.get_user_saved_ads(user.id) or []} if user else {}

        property_ads = AdMatcherService.find_similar_ads_for_wanted_ad(wanted_id, uow)
        for ad in property_ads:
            if ad.image_file_ids:
                if file := uow.files.get(id=ad.image_file_ids[0]):
                    ad.images = [file.dumps()] if file.url else []
            else:
                ad.images = []
        property_ads = remove_user_objects(property_ads)
        return (
            [pad.dumps(is_saved=saved_ads_ids.get(pad.id, False), images=pad.images) for pad in property_ads]
            if property_ads
            else []
        )
