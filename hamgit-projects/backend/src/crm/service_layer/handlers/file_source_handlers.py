from datetime import datetime

from core.exceptions import ConflictException, NotFoundException
from crm.domain.entities.file_source import FileSource
from crm.entrypoints.request_models import UpsertFileSourceRequest
from unit_of_work import UnitOfWork


def create_file_source_handler(data: UpsertFileSourceRequest, uow: UnitOfWork) -> dict:
    with uow:
        existing_file_source = uow.file_sources.get(title=data.title)
        if existing_file_source:
            raise ConflictException(detail="file_source_already_exists")

        file_source = FileSource(**data.model_dump())
        uow.file_sources.add(file_source)
        uow.commit()
        return file_source.dumps()


def update_file_source_handler(file_source_id: int, data: UpsertFileSourceRequest, uow: UnitOfWork):
    with uow:
        file_source = uow.file_sources.get(id=file_source_id)
        if not file_source:
            raise NotFoundException(detail="file_source_not_found")
        file_source.title = data.title
        uow.file_sources.add(file_source)
        uow.commit()
        return file_source.dumps()


def get_all_file_sources_handler(uow: UnitOfWork):
    with uow:
        file_sources: list[FileSource] = (
            uow.session.query(FileSource).filter(FileSource.deleted_at.is_(None)).all()  # type: ignore
        )
        return [file_source.dumps() for file_source in file_sources]


def delete_file_source_handler(file_source_id: int, uow: UnitOfWork):
    with uow:
        file_source = uow.file_sources.get(id=file_source_id)
        if not file_source:
            raise NotFoundException(detail="file_source_not_found")
        file_source.deleted_at = datetime.now()
        uow.file_sources.add(file_source)
        uow.commit()
