import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from shared.domain.entities import Property


class PropertyRepository(AbstractRepository[Property], abc.ABC):

    @property
    def entity_type(self) -> Type[Property]:
        return Property


class SQLAlchemyPropertyRepository(AbstractSQLAlchemyRepository[Property], PropertyRepository): ...
