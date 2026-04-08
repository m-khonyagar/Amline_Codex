from core import helpers
from core.exceptions import ConflictException
from unit_of_work import UnitOfWork


def user_existence_handler(mobile: str, uow: UnitOfWork):
    with uow:
        validated_mobile = helpers.validate_mobile_number(mobile)
        user = uow.users.get_by_mobile(validated_mobile)
        if user:
            raise ConflictException(detail="user exist")
        return True
