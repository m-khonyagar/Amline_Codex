import abc
from typing import Type, no_type_check

from sqlalchemy import text

from contract.domain.entities import Contract
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class ContractRepository(AbstractRepository[Contract], abc.ABC):

    @property
    def entity_type(self) -> Type[Contract]:
        return Contract

    @abc.abstractmethod
    def get_by_user_id(self, user_id: int) -> list[Contract]:
        raise NotImplementedError


class SQLAlchemyContractRepository(AbstractSQLAlchemyRepository[Contract], ContractRepository):

    @no_type_check
    def get_by_user_id(self, user_id: int) -> list[Contract]:
        query_result = self.session.execute(
            text("select contract_id from contract.contract_parties where user_id = :user_id and deleted_at is null"),
            {"user_id": user_id},
        ).fetchall()

        ids = [row.contract_id for row in query_result]

        return self.query.filter(Contract.id.in_(ids)).all()
