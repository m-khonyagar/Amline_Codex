import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.landlord_file import LandlordFile


class LandlordFileRepository(AbstractRepository[LandlordFile], abc.ABC):
    @property
    def entity_type(self) -> Type[LandlordFile]:
        return LandlordFile


class SQLAlchemyLandlordFileRepository(AbstractSQLAlchemyRepository[LandlordFile], LandlordFileRepository):
    pass
