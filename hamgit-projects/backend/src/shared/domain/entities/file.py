from datetime import UTC, datetime

from core.base.base_entity import BaseEntity
from shared.domain.enums import FileAccess, FileType

FILE_TYPE_ACCESS_MAP = {
    FileType.AVATAR: FileAccess.PUBLIC,
    FileType.PROPERTY_DEED: FileAccess.PRIVATE,
    FileType.CHEQUE: FileAccess.PRIVATE,
    FileType.CONTRACT_PDF: FileAccess.PRIVATE,
    FileType.PROPERTY_IMAGE: FileAccess.PUBLIC,
}


class File(BaseEntity):
    id: int
    access: FileAccess
    type: FileType
    name: str
    size: int
    mime_type: str
    is_used: bool
    metadata: dict | None
    created_at: datetime
    deleted_at: datetime | None

    _url: str | None = None

    @property
    def url(self) -> str | None:
        return self._url

    @url.setter
    def url(self, value: str | None) -> None:
        self._url = value

    def __init__(
        self,
        type: FileType,
        extension: str,
        size: int,
        mime_type: str,
        is_used: bool = False,
        metadata: dict | None = None,
    ):
        self.id = self.next_id
        self.access = FILE_TYPE_ACCESS_MAP[type]
        self.type = type
        self.name = f"{self.id}.{extension}"
        self.size = size
        self.mime_type = mime_type
        self.is_used = is_used
        self.metadata = metadata
        self.created_at = datetime.now(tz=UTC)

    def delete(self) -> None:
        self.is_used = False
        self.deleted_at = datetime.now(tz=UTC)

    def dumps(self, **_) -> dict:
        if self.url:
            return {"id": str(self.id), "url": self.url}
        return {"id": str(self.id), "url": None}
