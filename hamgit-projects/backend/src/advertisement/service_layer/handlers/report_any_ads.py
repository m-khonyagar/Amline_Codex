from advertisement.domain.enums import AdCategory
from unit_of_work import UnitOfWork


def report_any_ad_handler(ad_id: int, type: AdCategory, description: str, uow: UnitOfWork):

    with uow:
        match type:
            case AdCategory.SWAP_AD:
                repo = uow.swap_ads
            case AdCategory.AD:
                repo = uow.property_ads
            case AdCategory.WANTED_AD:
                repo = uow.property_wanted_ads

        ad = repo.get_or_raise(id=ad_id)
        ad.is_reported = True
        ad.report_description = description

        uow.commit()

        return True
