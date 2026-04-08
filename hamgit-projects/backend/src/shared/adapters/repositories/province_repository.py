import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from shared.domain.entities import Province


class ProvinceRepository(AbstractRepository[Province], abc.ABC):

    @property
    def entity_type(self) -> Type[Province]:
        return Province

    @abc.abstractmethod
    def all_provinces(self) -> list[Province]:
        raise NotImplementedError


class SQLAlchemyProvinceRepository(AbstractSQLAlchemyRepository, ProvinceRepository):

    def all_provinces(self) -> list[Province]:
        return self.query.all()
