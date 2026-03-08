import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.file_connection import FileConnection


class FileConnectionRepository(AbstractRepository[FileConnection], abc.ABC):
    @property
    def entity_type(self) -> Type[FileConnection]:
        return FileConnection


class SQLAlchemyFileConnectionRepository(AbstractSQLAlchemyRepository[FileConnection], FileConnectionRepository):
    pass
