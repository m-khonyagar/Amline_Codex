import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.file_source import FileSource


class FileSourceRepository(AbstractRepository[FileSource], abc.ABC):
    @property
    def entity_type(self) -> Type[FileSource]:
        return FileSource


class SQLAlchemyFileSourceRepository(AbstractSQLAlchemyRepository[FileSource], FileSourceRepository):
    pass
