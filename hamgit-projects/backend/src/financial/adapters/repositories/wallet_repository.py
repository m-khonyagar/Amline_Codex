import abc
from typing import Type, no_type_check

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from financial.domain.entities.wallet import Wallet


class WalletRepository(AbstractRepository[Wallet], abc.ABC):

    @property
    def entity_type(self) -> Type[Wallet]:
        return Wallet

    @abc.abstractmethod
    def get_by_user_id(self, user_id: int) -> list[Wallet]:
        raise NotImplementedError


class SQLAlchemyWalletRepository(AbstractSQLAlchemyRepository[Wallet], WalletRepository):

    @no_type_check
    def get_by_user_id(self, user_id: int) -> list[Wallet]:
        query = self.query.filter(
            Wallet.user_id == user_id,
            Wallet.deleted_at.is_(None),
        )

        return query.all()
