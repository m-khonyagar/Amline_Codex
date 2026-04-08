from account.domain.enums import UserRole
from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def delete_swap_ad_handler(swap_ad_id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        swap_ad = uow.swap_ads.get_or_raise(id=swap_ad_id)
        if swap_ad.user_id != current_user.id and UserRole.SUPERUSER not in current_user.roles:
            raise PermissionException(perm_trans.access_denied)
        swap_ad.soft_delete()
        uow.commit()
        return True
