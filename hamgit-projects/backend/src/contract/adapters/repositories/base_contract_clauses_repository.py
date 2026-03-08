import abc
from typing import Type

from contract.domain.entities.base_contract_clauses import BaseContractClauses
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class BaseContractClausesRepository(AbstractRepository[BaseContractClauses], abc.ABC):

    @property
    def entity_type(self) -> Type[BaseContractClauses]:
        return BaseContractClauses


class SQLAlchemyBaseContractClausesRepository(AbstractSQLAlchemyRepository, BaseContractClausesRepository):

    pass
