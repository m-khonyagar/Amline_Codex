from crm.domain.entities.file_label import FileLabel
from unit_of_work import UnitOfWork


def get_user_detail_view(user_id: int, uow: UnitOfWork) -> dict:
    with uow:
        user = uow.users.get_or_raise(id=user_id)
        if user.avatar_file_id:
            user.avatar_file = uow.files.get_or_raise(id=user.avatar_file_id).dumps()

        labels: list[FileLabel] = []
        if user.label_ids:
            labels = uow.session.query(FileLabel).filter(FileLabel.id.in_(user.label_ids)).all()  # type: ignore

        return user.dumps(labels=[label.dumps() for label in labels])
