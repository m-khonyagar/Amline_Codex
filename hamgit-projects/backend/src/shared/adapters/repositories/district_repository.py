import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from shared.domain.entities import District


class DistrictRepository(AbstractRepository[District], abc.ABC):

    @property
    def entity_type(self) -> Type[District]:
        return District

    @abc.abstractmethod
    def get_by_city(self, city_id: int) -> list[District]:
        raise NotImplementedError


class SQLAlchemyDistrictRepository(AbstractSQLAlchemyRepository, DistrictRepository):

    def get_by_city(self, city_id: int) -> list[District]:
        return self.query.filter_by(city_id=city_id, deleted_at=None).all()
