from dataclasses import dataclass
from datetime import date

from crm.domain.enums import (
    CallStatus,
    FileConnectionInitiator,
    FileConnectionStatus,
    FileStatus,
    ListingType,
    MonopolyStatus,
    TaskStatus,
)


@dataclass
class FileQueryParams:
    is_archived: bool = False
    search: str | None = None
    mobile: str | None = None
    status: FileStatus | None = None
    assigned_to: int | None = None
    call_status: CallStatus | None = None

    max_rent: int | None = None
    min_rent: int | None = None
    max_deposit: int | None = None
    min_deposit: int | None = None
    max_area: int | None = None
    min_area: int | None = None

    monopoly: MonopolyStatus | None = None

    city_ids_str: str | None = None
    district_ids_str: str | None = None
    label_ids_str: str | None = None
    regions_str: str | None = None

    start_date: date | None = None
    end_date: date | None = None

    family_members_count: int | None = None

    ad_id: int | None = None
    description: str | None = None

    listing_type: ListingType | None = None

    @property
    def city_ids(self) -> list[int] | None:
        if self.city_ids_str:
            return [int(id) for id in self.city_ids_str.split(",") if id.isdigit()]
        return None

    @property
    def district_ids(self) -> list[int] | None:
        if self.district_ids_str:
            return [int(id) for id in self.district_ids_str.split(",") if id.isdigit()]
        return None

    @property
    def label_ids(self) -> list[int] | None:
        if self.label_ids_str:
            return [int(id) for id in self.label_ids_str.split(",") if id.isdigit()]
        return None

    @property
    def regions(self) -> list[int] | None:
        if self.regions_str:
            return [int(id) for id in self.regions_str.split(",") if id.isdigit()]
        return None


@dataclass
class TaskQueryParams:
    search: str | None = None
    status: TaskStatus | None = None
    assigned_to: int | None = None


@dataclass
class FileConnectionQueryParams:
    initiator: FileConnectionInitiator | None = None
    status: FileConnectionStatus | None = None
    landlord_file_id: int | None = None
    tenant_file_id: int | None = None
