import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.task import Task


class TaskRepository(AbstractRepository[Task], abc.ABC):
    @property
    def entity_type(self) -> Type[Task]:
        return Task


class SQLAlchemyTaskRepository(AbstractSQLAlchemyRepository[Task], TaskRepository):
    pass
