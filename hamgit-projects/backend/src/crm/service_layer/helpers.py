from account.domain.entities.user import User
from core.exceptions import PermissionException


def can_modify(current_user: User, creator_id: int, assignee_id: int) -> None:
    if not (current_user.id == creator_id or current_user.id == assignee_id or current_user.is_admin):
        raise PermissionException()
