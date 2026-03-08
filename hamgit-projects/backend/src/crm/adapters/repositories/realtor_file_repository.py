import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.realtor_file import RealtorFile


class RealtorFileRepository(AbstractRepository[RealtorFile], abc.ABC):
    @property
    def entity_type(self) -> Type[RealtorFile]:
        return RealtorFile


class SQLAlchemyRealtorFileRepository(AbstractSQLAlchemyRepository[RealtorFile], RealtorFileRepository):
    pass
