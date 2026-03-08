import abc
from typing import Type, no_type_check

import sqlalchemy as sa

from account.domain.entities import RefreshToken
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class RefreshTokenRepository(AbstractRepository[RefreshToken], abc.ABC):

    @abc.abstractmethod
    def get_by_token(self, token: str) -> RefreshToken | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_user_id(self, user_id: int) -> list[RefreshToken]:
        raise NotImplementedError


class SQLAlchemyRefreshTokenRepository(AbstractSQLAlchemyRepository[RefreshToken], RefreshTokenRepository):

    @property
    def entity_type(self) -> Type[RefreshToken]:
        return RefreshToken

    @no_type_check
    def get_by_token(self, token: str) -> RefreshToken | None:
        return self.query.filter(RefreshToken.token == token).one_or_none()

    @no_type_check
    def get_by_user_id(self, user_id: int) -> list[RefreshToken]:
        return self.query.filter(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked.is_(False),
            RefreshToken.expires_at > sa.func.now(),
        ).all()
