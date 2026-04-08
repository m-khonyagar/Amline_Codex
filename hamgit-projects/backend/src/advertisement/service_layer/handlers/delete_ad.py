from account.domain.enums import UserRole
from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def delete_ad_handler(id: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        property_ad = uow.property_ads.get_or_raise(id=id)
        if property_ad.user_id != current_user.id and UserRole.SUPERUSER not in current_user.roles:
            raise PermissionException(perm_trans.access_denied)
        property_ad.soft_delete()
        uow.commit()
        return True
