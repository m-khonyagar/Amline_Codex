import abc
from typing import Type, no_type_check

from sqlalchemy import or_

from account.domain.entities import User
from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)


class UserRepository(AbstractRepository[User], abc.ABC):

    @property
    def entity_type(self) -> Type[User]:
        return User

    @abc.abstractmethod
    def get_by_mobile(self, mobile: str) -> User | None:
        raise NotImplementedError

    @abc.abstractmethod
    def check_national_code_exists(self, national_code: str, exclude_user_id: int) -> bool:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_mobile_or_national_code(self, mobile: str, national_code: str) -> User | None:
        raise NotImplementedError

    @abc.abstractmethod
    def get_or_create(self, mobile: str) -> User:
        raise NotImplementedError


class SQLAlchemyUserRepository(AbstractSQLAlchemyRepository[User], UserRepository):

    def get_by_mobile(self, mobile: str) -> User | None:
        return self.query.filter_by(mobile=mobile).one_or_none()

    @no_type_check
    def get_by_mobile_or_national_code(self, mobile: str, national_code: str) -> User | None:
        return self.query.filter(
            or_(User.mobile == mobile, User.national_code == national_code),
            User.deleted_at.is_(None),
        ).first()

    @no_type_check
    def check_national_code_exists(self, national_code: str, exclude_user_id: int) -> bool:
        return (
            self.query.filter(
                User.national_code == national_code,
                User.id != exclude_user_id,
                User.deleted_at.is_(None),
            ).count()
            > 0
        )

    def get_or_create(self, mobile: str) -> User:
        user = self.get_by_mobile(mobile)
        if user:
            return user
        user = User(mobile=mobile)
        self.add(user)
        return user
