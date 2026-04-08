import abc
from typing import Type, no_type_check

from contract.domain.entities import ContractClause
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class ContractClauseRepository(AbstractRepository[ContractClause], abc.ABC):

    @property
    def entity_type(self) -> Type[ContractClause]:
        return ContractClause

    @abc.abstractmethod
    def get_by_contract_id(self, contract_id: int) -> list[ContractClause]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_contract_id_and_clause_number(
        self, contract_id: int, clause_number: int, min_subclause_number: int = 1
    ) -> list[ContractClause]:
        raise NotImplementedError


class SQLAlchemyContractClauseRepository(AbstractSQLAlchemyRepository[ContractClause], ContractClauseRepository):

    @no_type_check
    def get_by_contract_id(self, contract_id: int) -> list[ContractClause]:
        return (
            self.query.filter(ContractClause.contract_id == contract_id, ContractClause.deleted_at.is_(None))
            .order_by(ContractClause.clause_number, ContractClause.subclause_number)
            .all()
        )

    @no_type_check
    def get_by_contract_id_and_clause_number(
        self, contract_id: int, clause_number: int, min_subclause_number: int = 1
    ) -> list[ContractClause]:
        return (
            self.query.filter(
                ContractClause.contract_id == contract_id,
                ContractClause.clause_number == clause_number,
                ContractClause.subclause_number >= min_subclause_number,
                ContractClause.deleted_at.is_(None),
            )
            .order_by(ContractClause.subclause_number)
            .all()
        )
