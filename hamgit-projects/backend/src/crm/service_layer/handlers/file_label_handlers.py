from datetime import datetime

from core.exceptions import ConflictException, NotFoundException
from crm.domain.entities.file_label import FileLabel
from crm.domain.enums import LabelType
from crm.entrypoints.request_models import UpsertFileLabelRequest
from unit_of_work import UnitOfWork


def create_file_label_handler(data: UpsertFileLabelRequest, uow: UnitOfWork) -> dict:
    with uow:
        existing_file_label = uow.file_labels.get(title=data.title, type=data.type)
        if existing_file_label:
            raise ConflictException(detail="file_label_already_exists")

        file_label = FileLabel(**data.model_dump())
        uow.file_labels.add(file_label)
        uow.commit()
        return file_label.dumps()


def update_file_label_handler(file_label_id: int, data: UpsertFileLabelRequest, uow: UnitOfWork):
    with uow:
        file_label = uow.file_labels.get(id=file_label_id)
        if not file_label:
            raise NotFoundException(detail="file_label_not_found")
        file_label.title = data.title
        uow.file_labels.add(file_label)
        uow.commit()
        return file_label.dumps()


def get_all_file_labels_handler(uow: UnitOfWork, type: LabelType):
    with uow:
        file_labels: list[FileLabel] = (
            uow.session.query(FileLabel)
            .filter(
                FileLabel.deleted_at.is_(None),  # type: ignore
                FileLabel.type == type,
            )
            .all()
        )
        return [file_label.dumps() for file_label in file_labels]


def delete_file_label_handler(file_label_id: int, uow: UnitOfWork):
    with uow:
        file_label = uow.file_labels.get(id=file_label_id)
        if not file_label:
            raise NotFoundException(detail="file_label_not_found")
        file_label.deleted_at = datetime.now()
        uow.file_labels.add(file_label)
        uow.commit()
