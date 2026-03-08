from advertisement.domain.enums import AdStatus
from unit_of_work import UnitOfWork


def dearchive_wanted_ad_handler(property_wanted_ad_id: int, uow: UnitOfWork):

    with uow:
        property_wanted_ad = uow.property_wanted_ads.get_or_raise(id=property_wanted_ad_id)
        property_wanted_ad.status = (
            AdStatus.PENDING if property_wanted_ad.status == AdStatus.ARCHIVED else property_wanted_ad.status
        )
        uow.commit()
