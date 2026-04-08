import abc
from typing import Type, no_type_check

from contract.domain.entities import ContractDescription
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class ContractDescriptionRepository(AbstractRepository[ContractDescription], abc.ABC):

    @property
    def entity_type(self) -> Type[ContractDescription]:
        return ContractDescription

    @abc.abstractmethod
    def get_by_contract_id(self, contract_id: int) -> list[ContractDescription]:
        raise NotImplementedError


class SQLAlchemyContractDescriptionRepository(
    AbstractSQLAlchemyRepository[ContractDescription], ContractDescriptionRepository
):

    @no_type_check
    def get_by_contract_id(self, contract_id: int) -> list[ContractDescription]:
        return (
            self.query.filter(
                ContractDescription.contract_id == contract_id,
                ContractDescription.deleted_at.is_(None),
            )
            .order_by(ContractDescription.created_at.desc())
            .all()
        )
