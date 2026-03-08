import abc
from typing import Type, no_type_check

from contract.domain.entities import ContractStep
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class ContractStepRepository(AbstractRepository[ContractStep], abc.ABC):

    @property
    def entity_type(self) -> Type[ContractStep]:
        return ContractStep

    def add_step(self, contract_id: int, type: str) -> ContractStep:

        step_exists = self.get_by_contract_id_and_type(contract_id, type)

        if step_exists and step_exists.is_completed:
            return step_exists

        if step_exists and not step_exists.is_completed:
            step_exists.revoke()

        step = ContractStep(contract_id=contract_id, type=type)
        step.mark_as_completed()
        self.add(step)
        return step

    def revoke_step_if_exists(self, contract_id: int, step_type: str) -> ContractStep | None:
        step = self.get_by_contract_id_and_type(contract_id, step_type)
        if step:
            step.revoke()
        return step

    @abc.abstractmethod
    def get_by_contract_id(self, contract_id: int) -> list[ContractStep]: ...

    @abc.abstractmethod
    def get_contract_completed_steps(self, contract_id: int) -> list[ContractStep]: ...

    @abc.abstractmethod
    def get_by_contract_id_and_type(self, contract_id: int, step_type: str) -> ContractStep | None: ...

    @abc.abstractmethod
    def get_by_contract_id_and_types(self, contract_id: int, step_types: list[str]) -> list[ContractStep]: ...


class SQLAlchemyContractStepRepository(AbstractSQLAlchemyRepository[ContractStep], ContractStepRepository):

    @no_type_check
    def get_by_contract_id(self, contract_id: int) -> list[ContractStep]:
        return self.query.filter(
            ContractStep.contract_id == contract_id,
            ContractStep.deleted_at.is_(None),
        ).all()

    @no_type_check
    def get_by_contract_id_and_type(self, contract_id: int, step_type: str) -> ContractStep | None:
        return self.query.filter(
            ContractStep.contract_id == contract_id,
            ContractStep.type == step_type,
            ContractStep.deleted_at.is_(None),
        ).one_or_none()

    @no_type_check
    def get_by_contract_id_and_types(self, contract_id: int, step_types: list[str]) -> list[ContractStep]:
        return self.query.filter(
            ContractStep.contract_id == contract_id,
            ContractStep.type.in_(step_types),
            ContractStep.deleted_at.is_(None),
        ).all()

    @no_type_check
    def get_contract_completed_steps(self, contract_id: int) -> list[ContractStep]:
        return self.query.filter(
            ContractStep.contract_id == contract_id,
            ContractStep.completed_at.isnot(None),
            ContractStep.deleted_at.is_(None),
        ).all()
