import abc
from typing import Type

from sqlalchemy.orm import Session

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from shared.domain.entities import File
from shared.service_layer.exceptions import FileIsNotPublicException
from shared.service_layer.services.storage_service import StorageService


class FileRepository(AbstractRepository[File], abc.ABC):

    @property
    def entity_type(self) -> Type[File]:
        return File


class SQLAlchemyFileRepository(AbstractSQLAlchemyRepository[File], FileRepository):

    def __init__(self, session: Session, *args, **kwargs) -> None:
        self.storage: StorageService = kwargs["storage"]
        super().__init__(session, *args, **kwargs)

    def get(self, **kwargs) -> File | None:
        file = super().get(**kwargs)
        if file:
            try:
                file.url = self.storage.get_url(file)
            except FileIsNotPublicException:
                pass
        return file
