import datetime as dt
import random
import string

from account.domain.entities.user import User
from contract.domain import enums
from core.base.base_entity import BaseEntity
from shared.domain.entities.file import File


class Contract(BaseEntity):
    id: int
    owner_user_id: int
    type: enums.ContractType
    status: enums.ContractStatus
    password: str | None
    pdf_file_id: int | None

    # this field added because owner_user_id is either tenant or landlord and not admin
    # and changing that might break the system. so we're forced to add an extra field.
    created_by: int
    created_by_user: User

    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self,
        owner_user_id: int,
        type: enums.ContractType,
        created_by: int,
        status: enums.ContractStatus = enums.ContractStatus.DRAFT,
    ) -> None:
        self.owner_user_id = owner_user_id
        self.type = type
        self.status = status
        self.password = self._generate_password()
        self.created_by = created_by

    def update_status(self, status: enums.ContractStatus) -> None:
        if not self.status == status:
            self.status = status

    def _generate_password(self, length: int = 8) -> str:
        characters = string.ascii_letters + string.digits
        password = "".join(random.choice(characters) for _ in range(length))
        return password

    @property
    def pdf_file(self) -> dict | None:
        return {"id": self.pdf_file_id} if self.pdf_file_id else None

    @pdf_file.setter
    def pdf_file(self, file: File) -> None:
        self.pdf_file_id = file.id
        self.status = enums.ContractStatus.PDF_GENERATED

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            owner=kwargs.pop("owner", {"id": str(self.owner_user_id)}),
            type=enums.ContractType.resolve(self.type),
            status=enums.ContractStatus.resolve(self.status),
            password=self.password,
            pdf_file=self.pdf_file,
            created_by=str(self.created_by),
            created_by_user=self.created_by_user.short_dumps(),
            **kwargs,
        )
