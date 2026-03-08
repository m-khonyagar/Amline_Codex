from functools import wraps

from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from core.exceptions import PermissionException


def has_access(role_access: RoleAccess):

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):

            admin: User | None = next(
                (kwargs.get(key) for key in kwargs.keys() if key in ["current_user", "admin", "_"]), None
            )

            if not admin or not set(admin.roles) & set(role_access.value):
                raise PermissionException

            return func(*args, **kwargs)

        return wrapper

    return decorator
