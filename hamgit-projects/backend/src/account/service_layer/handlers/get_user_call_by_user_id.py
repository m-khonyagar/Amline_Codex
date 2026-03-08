from sqlalchemy import desc

from account.domain.entities.user_call import UserCall
from unit_of_work import UnitOfWork


def get_user_calls_by_user_id(user_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        user_calls: list[UserCall] = (
            uow.session.query(UserCall)
            .filter(UserCall.user_id == user_id)
            .order_by(desc(UserCall.created_at))  # type: ignore
            .all()
        )
        return [user_call.dumps() for user_call in user_calls]
