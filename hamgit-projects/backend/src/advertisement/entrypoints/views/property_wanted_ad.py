from account.domain.entities.user import User
from unit_of_work import UnitOfWork


def get_property_wanted_ad(user: User | None, id: int, uow: UnitOfWork):

    with uow:
        is_saved = uow.user_saved_ads.get_user_saved_ad(id, user.id) if user else None
        property_wanted_ad = uow.property_wanted_ads.single_property_wanted_ad(id=id)
        return property_wanted_ad.dumps(is_saved=bool(is_saved))
