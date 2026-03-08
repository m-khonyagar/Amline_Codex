import abc
from typing import Type

from core.base.abstract_repository import (
    AbstractRepository,
    AbstractSQLAlchemyRepository,
)
from crm.domain.entities.tenant_file import TenantFile


class TenantFileRepository(AbstractRepository[TenantFile], abc.ABC):
    @property
    def entity_type(self) -> Type[TenantFile]:
        return TenantFile


class SQLAlchemyTenantFileRepository(AbstractSQLAlchemyRepository[TenantFile], TenantFileRepository):
    pass
