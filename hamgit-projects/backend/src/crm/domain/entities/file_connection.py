from datetime import datetime

from account.domain.entities.user import User
from core.base.base_entity import BaseEntity
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.entities.tenant_file import TenantFile
from crm.domain.enums import FileConnectionInitiator, FileConnectionStatus


class FileConnection(BaseEntity):
    id: int
    landlord_file_id: int
    tenant_file_id: int
    status: FileConnectionStatus
    initiator: FileConnectionInitiator
    description: str | None

    created_by: int
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    created_by_user: User
    landlord_file: LandlordFile
    tenant_file: TenantFile

    def __init__(self, **kwargs):
        self.id = self.next_id
        for field in self.__annotations__:
            if field != "id":
                setattr(self, field, kwargs.get(field))

    def update(self, status: FileConnectionStatus | None = None, description: str | None = None):
        self.status = status or self.status
        self.description = description or self.description

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            landlord_file_id=str(self.landlord_file_id),
            tenant_file_id=str(self.tenant_file_id),
            created_by=str(self.created_by),
            created_by_user=self.created_by_user.short_dumps(),
            landlord_file=self.landlord_file.dumps(),
            tenant_file=self.tenant_file.dumps(),
            status=self.status,
            initiator=self.initiator,
            description=self.description,
            **kwargs,
        )
