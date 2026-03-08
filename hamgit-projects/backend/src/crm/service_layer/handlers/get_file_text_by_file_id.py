from sqlalchemy import asc

from account.domain.entities.user import User
from crm.domain.entities.file_text import FileText
from unit_of_work import UnitOfWork


def get_file_texts_by_file_id(file_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        file_texts: list[tuple[FileText, User]] = (
            uow.session.query(FileText, User)
            .join(User, FileText.created_by == User.id)
            .filter(FileText.file_id == file_id)
            .order_by(asc(FileText.created_at))  # type: ignore
            .all()
        )
        return [dict(**file_text.dumps(), user=user.short_dumps()) for file_text, user in file_texts]


def get_file_texts_by_user_id(user_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        user = uow.users.get_or_raise(id=user_id)
        file_texts: list[tuple[FileText, User]] = (
            uow.session.query(FileText, User)
            .join(User, FileText.created_by == User.id)
            .filter(FileText.mobile == user.mobile)
            .order_by(asc(FileText.created_at))  # type: ignore
            .all()
        )
        return [dict(**file_text.dumps(), user=user.short_dumps()) for file_text, user in file_texts]
