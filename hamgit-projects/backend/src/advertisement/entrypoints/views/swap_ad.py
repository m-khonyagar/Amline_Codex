from account.domain.entities.user import User
from unit_of_work import UnitOfWork


def get_swap_ad(user: User | None, id: int, uow: UnitOfWork):

    with uow:
        is_saved = uow.user_saved_ads.get_user_saved_ad(id, user.id) if user else None
        property_ad = uow.swap_ads.get_or_raise(id=id)
        return property_ad.dumps(is_saved=bool(is_saved))
