import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.file_call import FileCall


class FileCallRepository(AbstractRepository[FileCall], abc.ABC):
    @property
    def entity_type(self) -> Type[FileCall]:
        return FileCall


class SQLAlchemyFileCallRepository(AbstractSQLAlchemyRepository[FileCall], FileCallRepository):
    pass
