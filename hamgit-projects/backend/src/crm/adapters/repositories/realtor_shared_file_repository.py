import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.realtor_shared_file import RealtorSharedFile


class RealtorSharedFileRepository(AbstractRepository[RealtorSharedFile], abc.ABC):
    @property
    def entity_type(self) -> Type[RealtorSharedFile]:
        return RealtorSharedFile


class SQLAlchemyRealtorSharedFileRepository(
    AbstractSQLAlchemyRepository[RealtorSharedFile], RealtorSharedFileRepository
):
    pass
