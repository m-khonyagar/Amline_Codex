import datetime as dt
from dataclasses import dataclass
from typing import NamedTuple, TypedDict

from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import PartyType, TrackingCodeStatus


@dataclass
class ContractOwner:
    user_id: int
    party_type: PartyType

    def dumps(self) -> dict:
        return dict(
            user_id=str(self.user_id),
            party_type=self.party_type,
        )

    @property
    def is_tenant(self) -> bool:
        return self.party_type == PartyType.TENANT

    @property
    def is_landlord(self) -> bool:
        return self.party_type == PartyType.LANDLORD


@dataclass
class TrackingCode:
    status: TrackingCodeStatus
    value: str | None = None
    generation_date: dt.date | None = None

    @property
    def is_delivered(self) -> bool:
        return self.status == TrackingCodeStatus.DELIVERED

    def dumps(self) -> dict:
        return dict(
            status=TrackingCodeStatus.resolve(self.status),
            value=self.value,
            generation_date=self.generation_date,
        )


@dataclass
class PrContractBankAccounts:
    tenant: int
    landlord_rent: int
    landlord_deposit: int


class ContractCounterParty(TypedDict):
    party_type: PartyType
    user_id: int | None
    mobile: str
    national_code: str


class PrContractParties(NamedTuple):
    tenant: ContractParty
    landlord: ContractParty
