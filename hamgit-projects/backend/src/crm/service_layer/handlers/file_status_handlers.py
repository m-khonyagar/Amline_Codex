from datetime import datetime

from core.exceptions import ConflictException, NotFoundException
from crm.domain.entities.file_status import FileStatus
from crm.entrypoints.request_models import UpsertFileStatusRequest
from unit_of_work import UnitOfWork


def create_file_status_handler(data: UpsertFileStatusRequest, uow: UnitOfWork) -> dict:
    with uow:
        existing_file_status = uow.file_statuses.get(title=data.title)
        if existing_file_status:
            raise ConflictException(detail="file_status_already_exists")

        file_status = FileStatus(**data.model_dump())
        uow.file_statuses.add(file_status)
        uow.commit()
        return file_status.dumps()


def update_file_status_handler(file_status_id: int, data: UpsertFileStatusRequest, uow: UnitOfWork):
    with uow:
        file_status = uow.file_statuses.get(id=file_status_id)
        if not file_status:
            raise NotFoundException(detail="file_status_not_found")
        file_status.title = data.title
        uow.file_statuses.add(file_status)
        uow.commit()
        return file_status.dumps()


def get_all_file_statuses_handler(uow: UnitOfWork):
    with uow:
        file_statuses: list[FileStatus] = (
            uow.session.query(FileStatus).filter(FileStatus.deleted_at.is_(None)).all()  # type: ignore
        )
        return [file_status.dumps() for file_status in file_statuses]


def delete_file_status_handler(file_status_id: int, uow: UnitOfWork):
    with uow:
        file_status = uow.file_statuses.get(id=file_status_id)
        if not file_status:
            raise NotFoundException(detail="file_status_not_found")
        file_status.deleted_at = datetime.now()
        uow.file_statuses.add(file_status)
        uow.commit()
