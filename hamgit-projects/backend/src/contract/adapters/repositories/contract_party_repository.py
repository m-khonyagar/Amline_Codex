import abc
from typing import Protocol, Type, no_type_check

from account.domain.enums import UserRole
from contract.domain.entities import ContractParty
from contract.service_layer.exceptions import UserIsNotContractPartyException
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.exceptions import NotFoundException
from core.translates import not_found_trans


class UserProtocol(Protocol):
    id: int
    roles: list[UserRole]


class ContractPartyRepository(AbstractRepository[ContractParty], abc.ABC):

    @property
    def entity_type(self) -> Type[ContractParty]:
        return ContractParty

    def get_by_contract_id_and_user_or_raise(self, contract_id: int, user: UserProtocol) -> ContractParty:
        party = self._get_by_contract_id_and_user(contract_id, user)
        if not party:
            raise UserIsNotContractPartyException
        return party

    def get_contract_party_or_raise(self, contract_id: int, party_type: str) -> ContractParty:
        party = self.get_by_contract_id_and_party_type(contract_id, party_type)
        if not party:
            raise NotFoundException(not_found_trans.ContractParty)
        return party

    @abc.abstractmethod
    def get_by_contract_id_and_party_type(self, contract_id: int, party_type: str) -> ContractParty | None:
        raise NotImplementedError

    def get_by_contract_id_and_user(self, contract_id: int, user: UserProtocol) -> ContractParty | None:
        return self._get_by_contract_id_and_user(contract_id, user)

    @abc.abstractmethod
    def _get_by_contract_id_and_user(self, contract_id: int, user: UserProtocol) -> ContractParty | None:
        raise NotImplementedError

    def get_party_or_raise(self, contract_id: int, user_id: int, user_roles: list[UserRole]) -> ContractParty:
        party = self.get_by_contract_and_user(contract_id, user_id, user_roles)
        if not party:
            raise UserIsNotContractPartyException
        return party

    @abc.abstractmethod
    def get_by_contract_id(self, contract_id: int) -> list[ContractParty]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_contract_and_user(
        self, contract_id: int, user_id: int, user_roles: list[UserRole]
    ) -> ContractParty | None:
        raise NotImplementedError

    def get_counter_party(self, contract_id: int, party_id: int) -> ContractParty | None:
        parties = self.get_by_contract_id(contract_id)
        for party in parties:
            if party.id != party_id:
                return party
        return None


class SQLAlchemyContractPartyRepository(AbstractSQLAlchemyRepository[ContractParty], ContractPartyRepository):

    @no_type_check
    def get_by_contract_id(self, contract_id: int) -> list[ContractParty]:
        return self.query.filter(
            ContractParty.contract_id == contract_id,
            ContractParty.deleted_at.is_(None),
        ).all()

    @no_type_check
    def get_by_contract_and_user(
        self, contract_id: int, user_id: int, user_roles: list[UserRole]
    ) -> ContractParty | None:
        return self.query.filter(
            ContractParty.contract_id == contract_id,
            ContractParty.user_id == user_id,
            ContractParty.user_role.in_(user_roles),
            ContractParty.deleted_at.is_(None),
        ).first()

    @no_type_check
    def _get_by_contract_id_and_user(self, contract_id: int, user: UserProtocol) -> ContractParty | None:
        return self.query.filter(
            ContractParty.contract_id == contract_id,
            ContractParty.user_id == user.id,
            ContractParty.user_role.in_(user.roles),
            ContractParty.deleted_at.is_(None),
        ).first()

    @no_type_check
    def get_by_contract_id_and_party_type(self, contract_id: int, party_type: str) -> ContractParty | None:
        return self.query.filter(
            ContractParty.contract_id == contract_id,
            ContractParty.party_type == party_type,
            ContractParty.deleted_at.is_(None),
        ).first()
