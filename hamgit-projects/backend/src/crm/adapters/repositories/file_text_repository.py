import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.file_text import FileText


class FileTextRepository(AbstractRepository[FileText], abc.ABC):
    @property
    def entity_type(self) -> Type[FileText]:
        return FileText


class SQLAlchemyFileTextRepository(AbstractSQLAlchemyRepository[FileText], FileTextRepository):
    pass
