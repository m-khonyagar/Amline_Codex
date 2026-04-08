from advertisement.domain.enums import AdStatus
from unit_of_work import UnitOfWork


def dearchive_ad_handler(property_ad_id: int, uow: UnitOfWork):

    with uow:
        property_ad = uow.property_ads.get_or_raise(id=property_ad_id)
        property_ad.status = AdStatus.PENDING if property_ad.status == AdStatus.ARCHIVED else property_ad.status
        uow.commit()
