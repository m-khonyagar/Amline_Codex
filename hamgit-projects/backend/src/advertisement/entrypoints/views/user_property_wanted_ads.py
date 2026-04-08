from core.types import CurrentUser, PaginateParams
from unit_of_work import UnitOfWork


def get_user_property_wanted_ads(params: PaginateParams, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        property_wanted_ads = uow.property_wanted_ads.find_all_user_property_wanted_ads(current_user.id, params)
        return [pwd.dumps() for pwd in property_wanted_ads] if property_wanted_ads else []
