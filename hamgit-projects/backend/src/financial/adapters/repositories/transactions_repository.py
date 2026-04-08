import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from financial.domain.entities.transaction import Transaction


class TransactionRepository(AbstractRepository[Transaction], abc.ABC):

    def find_by_authority_code(self, authority_code: str) -> Transaction | None:
        return self._find_by_authority_code(authority_code)

    @abc.abstractmethod
    def _find_by_authority_code(self, authority_code: str) -> Transaction | None: ...


class SQLAlchemyTransactionRepository(AbstractSQLAlchemyRepository[Transaction], TransactionRepository):

    @property
    def entity_type(self) -> Type[Transaction]:
        return Transaction

    def _find_by_authority_code(self, authority_code: str) -> Transaction | None:
        return self.query.filter_by(authority_code=authority_code, deleted_at=None).one_or_none()
