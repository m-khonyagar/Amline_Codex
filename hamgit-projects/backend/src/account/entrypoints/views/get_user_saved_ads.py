from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.enums import AdCategory
from core.helpers import remove_user_objects
from unit_of_work import UnitOfWork


def get_user_saved_ads_list(user_id: int, uow: UnitOfWork) -> list[dict]:

    with uow:
        result: list[dict] = []
        user_saved_ads = uow.user_saved_ads.get_user_saved_ads(user_id)

        ad_ids_by_type: dict[AdCategory, list[int]] = {
            AdCategory.AD: [],
            AdCategory.SWAP_AD: [],
            AdCategory.WANTED_AD: [],
        }

        for saved_ad in user_saved_ads:
            ad_ids_by_type[saved_ad.ad_type].append(saved_ad.ad_id)

        property_ads = uow.property_ads.get_by_ids(ad_ids_by_type[AdCategory.AD])
        property_swap_ads = uow.swap_ads.get_by_ids(ad_ids_by_type[AdCategory.SWAP_AD])
        property_wanted_ads = uow.property_wanted_ads.get_by_ids(ad_ids_by_type[AdCategory.WANTED_AD])

        property_ads = _get_property_ads_images(property_ads, uow)
        property_swap_ads = remove_user_objects(property_swap_ads)
        property_wanted_ads = remove_user_objects(property_wanted_ads)

        property_ads_dict = {ad.id: ad for ad in property_ads}
        property_swap_ads_dict = {ad.id: ad for ad in property_swap_ads}
        property_wanted_ads_dict = {ad.id: ad for ad in property_wanted_ads}

        for saved_ad in user_saved_ads:
            ad_object = None
            match saved_ad.ad_type:
                case AdCategory.AD:
                    ad_object = property_ads_dict.get(saved_ad.ad_id)
                case AdCategory.SWAP_AD:
                    ad_object = property_swap_ads_dict.get(saved_ad.ad_id)
                case AdCategory.WANTED_AD:
                    ad_object = property_wanted_ads_dict.get(saved_ad.ad_id)

            if ad_object:
                saved_ad.ad_data = ad_object.dumps()
                result.append(saved_ad.dumps())
            else:
                saved_ad.soft_delete()

        uow.commit()

        return result


def _get_property_ads_images(ads: list[PropertyAd], uow: UnitOfWork) -> list[PropertyAd]:
    for ad in ads:
        if ad.image_file_ids:
            image_file = uow.files.get_by_id(ad.image_file_ids[0]) or None
            if image_file_data := (image_file.dumps() if image_file else None):
                ad.images = [image_file_data]
            else:
                ad.images = []

    return remove_user_objects(ads)
