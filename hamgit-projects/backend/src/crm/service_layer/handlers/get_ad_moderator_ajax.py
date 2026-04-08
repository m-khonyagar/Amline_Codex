from account.domain.entities.user import User
from account.domain.enums import UserRole
from unit_of_work import UnitOfWork


def get_ad_moderator_ajax(uow: UnitOfWork):
    with uow:
        users: list[User] = (
            uow.session.query(User).filter(User.roles.any(UserRole.AD_MODERATOR.value)).all()  # type: ignore
        )
        return [dict(id=str(user.id), fullname=user.fullname) for user in users]
