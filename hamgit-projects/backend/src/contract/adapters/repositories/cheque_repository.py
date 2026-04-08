import abc
from typing import Type

from contract.domain.entities import Cheque
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class ChequeRepository(AbstractRepository[Cheque], abc.ABC):

    @property
    def entity_type(self) -> Type[Cheque]:
        return Cheque


class SQLAlchemyChequeRepository(AbstractSQLAlchemyRepository[Cheque], ChequeRepository): ...
