from sqlalchemy import desc

from account.domain.entities.user_text import UserText
from unit_of_work import UnitOfWork


def get_user_texts_by_user_id(user_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        user_texts: list[UserText] = (
            uow.session.query(UserText)
            .filter(UserText.user_id == user_id)
            .order_by(desc(UserText.created_at))  # type: ignore
            .all()
        )
        return [user_text.dumps() for user_text in user_texts]
