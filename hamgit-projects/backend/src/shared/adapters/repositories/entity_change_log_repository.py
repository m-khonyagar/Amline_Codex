import abc
from typing import Type

from sqlalchemy import desc

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from shared.domain.entities import EntityChangeLog


class EntityChangeLogRepository(AbstractRepository[EntityChangeLog], abc.ABC):
    @property
    def entity_type(self) -> Type[EntityChangeLog]:
        return EntityChangeLog

    @abc.abstractmethod
    def get_by_entity_id(self, entity_id: int) -> list[EntityChangeLog]:
        raise NotImplementedError


class SQLAlchemyEntityChangeLogRepository(AbstractSQLAlchemyRepository[EntityChangeLog], EntityChangeLogRepository):
    def get_by_entity_id(self, entity_id: int) -> list[EntityChangeLog]:
        return (
            self.query.filter(EntityChangeLog.entity_id == entity_id)  # type: ignore
            .order_by(desc(EntityChangeLog.created_at))  # type: ignore
            .all()
        )
