import abc
from typing import Type, no_type_check

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from core.exceptions import NotFoundException
from core.translates import not_found_trans
from shared.domain.entities import City
from shared.domain.entities.province import Province


class CityRepository(AbstractRepository[City], abc.ABC):

    @property
    def entity_type(self) -> Type[City]:
        return City

    def get_by_id_or_raise(self, entity_id: int) -> City:
        city = self.get_by_id(entity_id)
        if not city:
            raise NotFoundException(not_found_trans.City)
        return city

    @abc.abstractmethod
    def all_cities(self) -> list[City]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_province_id(self, province_id: int) -> list[City]:
        raise NotImplementedError


class SQLAlchemyCityRepository(AbstractSQLAlchemyRepository, CityRepository):

    def all_cities(self) -> list[City]:
        return self.query.all()

    def get_by_province_id(self, province_id: int) -> list[City]:
        return self.query.filter_by(province_id=province_id).all()

    @no_type_check
    def get_by_id(self, entity_id: int) -> City | None:
        stmt: tuple[City, Province] | None = (
            self.session.query(City, Province)
            .join(Province)
            .filter(City.id == entity_id, City.deleted_at.is_(None))
            .first()
        )

        if stmt:
            city, province = stmt
            city.province = province
            return city

        return None
