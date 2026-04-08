import abc
from typing import Type

from account.domain.entities.user_text import UserText
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class UserTextRepository(AbstractRepository[UserText], abc.ABC):
    @property
    def entity_type(self) -> Type[UserText]:
        return UserText


class SQLAlchemyUserTextRepository(AbstractSQLAlchemyRepository[UserText], UserTextRepository):
    pass
