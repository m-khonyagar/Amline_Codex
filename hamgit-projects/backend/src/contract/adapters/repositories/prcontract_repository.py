import abc
from typing import Type, no_type_check

from sqlalchemy import text

from contract.domain.entities import PropertyRentContract
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.exceptions import NotFoundException
from core.translates import not_found_trans


class PRContractRepository(AbstractRepository[PropertyRentContract], abc.ABC):

    @property
    def entity_type(self) -> Type[PropertyRentContract]:
        return PropertyRentContract

    @abc.abstractmethod
    def get_by_contract_id(self, contract_id: int) -> PropertyRentContract | None:
        raise NotImplementedError

    def get_by_contract_id_or_raise(self, contract_id: int) -> PropertyRentContract:
        prc = self.get_by_contract_id(contract_id)
        if prc is None:
            raise NotFoundException(not_found_trans.PropertyRentContract)
        return prc

    @abc.abstractmethod
    def get_by_user_id(self, user_id: int) -> list[PropertyRentContract]:
        raise NotImplementedError


class SQLAlchemyPRContractRepository(AbstractSQLAlchemyRepository[PropertyRentContract], PRContractRepository):

    @no_type_check
    def get_by_contract_id(self, contract_id: int) -> PropertyRentContract | None:
        return self.query.filter(
            PropertyRentContract.contract_id == contract_id,
            PropertyRentContract.deleted_at.is_(None),
        ).one_or_none()

    @no_type_check
    def get_by_user_id(self, user_id: int) -> list[PropertyRentContract]:
        query_result = self.session.execute(
            text("select contract_id from contract.contract_parties where user_id = :user_id"),
            {"user_id": user_id},
        ).fetchall()

        ids = [row.contract_id for row in query_result]

        return self.query.filter(
            PropertyRentContract.contract_id.in_(ids),
            PropertyRentContract.deleted_at.is_(None),
        ).all()
