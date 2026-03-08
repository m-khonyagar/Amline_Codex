import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.file_status import FileStatus


class FileStatusRepository(AbstractRepository[FileStatus], abc.ABC):
    @property
    def entity_type(self) -> Type[FileStatus]:
        return FileStatus


class SQLAlchemyFileStatusRepository(AbstractSQLAlchemyRepository[FileStatus], FileStatusRepository):
    pass
