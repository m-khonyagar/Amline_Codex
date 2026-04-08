import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.file_label import FileLabel


class FileLabelRepository(AbstractRepository[FileLabel], abc.ABC):
    @property
    def entity_type(self) -> Type[FileLabel]:
        return FileLabel


class SQLAlchemyFileLabelRepository(AbstractSQLAlchemyRepository[FileLabel], FileLabelRepository):
    pass
