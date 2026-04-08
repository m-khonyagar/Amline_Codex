import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from financial.domain.entities.settlement import Settlement


class SettlementRepository(AbstractRepository[Settlement], abc.ABC): ...


class SQLALchemySettlementRepository(AbstractSQLAlchemyRepository[Settlement], SettlementRepository):

    @property
    def entity_type(self) -> Type[Settlement]:
        return Settlement
