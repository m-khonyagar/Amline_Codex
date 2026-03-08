import abc
from typing import Type, no_type_check

from account.domain.entities import BankAccount
from account.domain.enums import UserRole
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class BankAccountRepository(AbstractRepository[BankAccount], abc.ABC):
    @property
    def entity_type(self) -> Type[BankAccount]:
        return BankAccount

    @abc.abstractmethod
    def get_user_first_bank_account(self, user_id: int) -> BankAccount | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_user_id(self, user_id: int) -> list[BankAccount]: ...

    @abc.abstractmethod
    def get_user_bank_accounts(self, user_id: int, user_roles: list[UserRole]) -> list[BankAccount]: ...

    @abc.abstractmethod
    def get_by_iban_and_user(self, iban: str, user_id: int, user_role: UserRole) -> BankAccount | None: ...


class SQLAlchemyBankAccountRepository(AbstractSQLAlchemyRepository[BankAccount], BankAccountRepository):

    def get_by_user_id(self, user_id: int) -> list[BankAccount]:
        return self.query.filter_by(user_id=user_id, deleted_at=None).all()

    @no_type_check
    def get_user_bank_accounts(self, user_id: int, user_roles: list[UserRole]) -> list[BankAccount]:
        return self.query.filter(
            BankAccount.user_id == user_id,
            BankAccount.user_role.in_(user_roles),
            BankAccount.deleted_at.is_(None),
        ).all()

    @no_type_check
    def get_by_iban_and_user(self, iban: str, user_id: int, user_role: UserRole) -> BankAccount | None:
        return self.query.filter(
            BankAccount.iban == iban,
            BankAccount.user_id == user_id,
            BankAccount.user_role == user_role,
            BankAccount.deleted_at.is_(None),
        ).first()

    def get_user_first_bank_account(self, user_id: int) -> BankAccount | None:
        return self.query.filter_by(user_id=user_id, deleted_at=None).first()
