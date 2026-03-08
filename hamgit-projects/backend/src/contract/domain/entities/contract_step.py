import datetime as dt

from contract.domain.enums import PartyType, PRContractStep
from core.base.base_entity import BaseEntity


class ContractStep(BaseEntity):
    id: int
    contract_id: int
    type: str
    completed_at: dt.datetime | None
    metadata: dict
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self, contract_id: int, type: str, completed_at: dt.datetime | None = None, metadata: dict = dict()
    ) -> None:
        self.id = self.next_id
        self.contract_id = contract_id
        self.type = type
        self.completed_at = completed_at
        self.metadata = metadata

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            contract=kwargs.get("contract", dict(id=str(self.contract_id))),
            type=self.type,
            completed_at=self.completed_at,
            **kwargs,
        )

    def mark_as_completed(self) -> None:
        self.completed_at = dt.datetime.now(tz=dt.timezone.utc)

    def revoke(self, detail: dict | None = None) -> None:

        if not self.metadata:
            self.metadata = dict()

        if detail:
            self.metadata["revoke_detail"] = detail

        self.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

    @property
    def is_completed(self) -> bool:
        return (self.completed_at is not None) and (self.deleted_at is None)

    @property
    def is_revoked(self) -> bool:
        return self.deleted_at is not None

    @classmethod
    def create_rejected_step(cls, contract_id: int, party_type: PartyType) -> "ContractStep":
        return cls(
            contract_id,
            PRContractStep.LANDLORD_REJECTED if party_type == PartyType.LANDLORD else PRContractStep.TENANT_REJECTED,
        )
