import abc
from typing import Type, no_type_check

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from financial.domain.entities.wallet_transaction import WalletTransaction


class WalletTransactionRepository(AbstractRepository[WalletTransaction], abc.ABC):

    @property
    def entity_type(self) -> Type[WalletTransaction]:
        return WalletTransaction

    @abc.abstractmethod
    def get_by_wallet_id(self, wallet_id: int) -> list[WalletTransaction]:
        raise NotImplementedError


class SQLAlchemyWalletTransactionRepository(
    AbstractSQLAlchemyRepository[WalletTransaction], WalletTransactionRepository
):

    @no_type_check
    def get_by_wallet_id(self, wallet_id: int) -> list[WalletTransaction]:
        query = self.query.filter(
            WalletTransaction.wallet_id == wallet_id,
            WalletTransaction.deleted_at.is_(None),
        )

        return query.all()
