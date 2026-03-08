from account.domain.entities.user import User
from advertisement.entrypoints.request_models import GetPropertyAdFilter
from core.types import PaginateParams
from unit_of_work import UnitOfWork


def get_property_ads(user: User | None, params: PaginateParams, filters: GetPropertyAdFilter, uow: UnitOfWork):
    with uow:
        saved_ads_ids = {ad.ad_id: True for ad in uow.user_saved_ads.get_user_saved_ads(user.id) or []} if user else {}
        property_ads = uow.property_ads.find_all_property_ads(filters, params)
        for ad in property_ads:
            if ad.image_file_ids:
                if file := uow.files.get(id=ad.image_file_ids[0]):
                    ad.images = [file.dumps()] if file.url else []
            else:
                ad.images = []
        # property_ads = remove_user_objects(property_ads)
        return (
            [
                property_ad.dumps(is_saved=saved_ads_ids.get(property_ad.id, False), images=property_ad.images)
                for property_ad in property_ads
            ]
            if property_ads
            else []
        )
