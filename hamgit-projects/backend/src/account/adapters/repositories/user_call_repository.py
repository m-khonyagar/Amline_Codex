import abc
from typing import Type

from account.domain.entities.user_call import UserCall
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class UserCallRepository(AbstractRepository[UserCall], abc.ABC):
    @property
    def entity_type(self) -> Type[UserCall]:
        return UserCall


class SQLAlchemyUserCallRepository(AbstractSQLAlchemyRepository[UserCall], UserCallRepository):
    pass
