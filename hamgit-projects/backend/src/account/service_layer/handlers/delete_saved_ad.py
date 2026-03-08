from core.exceptions import PermissionException
from core.translates import perm_trans
from unit_of_work import UnitOfWork


def delete_saved_ad_handler(ad_id: int, user_id: int, uow: UnitOfWork) -> bool:
    with uow:
        saved_ad = uow.user_saved_ads.get_or_raise(ad_id=ad_id, user_id=user_id)

        if saved_ad.user_id != user_id:
            raise PermissionException(perm_trans.you_are_not_allowed_to_perform_this_action)
        saved_ad.soft_delete()
        uow.commit()

        return True
