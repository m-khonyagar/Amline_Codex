import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.task_report import TaskReport


class TaskReportRepository(AbstractRepository[TaskReport], abc.ABC):
    @property
    def entity_type(self) -> Type[TaskReport]:
        return TaskReport


class SQLAlchemyTaskReportRepository(AbstractSQLAlchemyRepository[TaskReport], TaskReportRepository):
    pass
