from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_user_property_ads(uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        property_ads = uow.property_ads.find_by_user_id(current_user.id)
        for ad in property_ads:
            if ad.image_file_ids:
                if file := uow.files.get(id=ad.image_file_ids[0]):
                    ad.images = [file.dumps()] if file.url else []
            else:
                ad.images = []
        return [property_wanted_ad.dumps() for property_wanted_ad in property_ads] if property_ads else []
