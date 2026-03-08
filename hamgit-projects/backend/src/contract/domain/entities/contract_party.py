import datetime as dt

from account.domain.enums import UserRole
from contract.domain.enums import PartyType, SignatureType
from core.base.base_entity import BaseEntity


class ContractParty(BaseEntity):
    id: int
    contract_id: int
    user_id: int
    user_role: UserRole
    party_type: PartyType

    signature_type: SignatureType | None
    signed_at: dt.datetime | None
    signature_data: dict | None

    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self, contract_id: int, user_id: int, party_type: PartyType, user_role: UserRole = UserRole.PERSON, **kwargs
    ) -> None:
        self.id = self.next_id
        self.contract_id = contract_id
        self.user_id = user_id
        self.user_role = user_role
        self.party_type = party_type

    def delete(self) -> None:
        self.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            contract=kwargs.pop("contract", dict(id=str(self.contract_id))),
            user=kwargs.pop("user", dict(id=str(self.user_id), role=self.user_role)),
            party_type=PartyType.resolve(self.party_type),
            signature_type=SignatureType.safe_resolve(self.signature_type),
            signed_at=self.signed_at,
            **kwargs,
        )

    def sign(
        self,
        signature_data: dict,
        signed_at: dt.datetime,
        signature_type: SignatureType = SignatureType.OTP,
    ) -> None:
        self.signature_type = signature_type
        self.signature_data = signature_data
        self.signed_at = signed_at

    @property
    def has_been_signed(self) -> bool:
        return self.signed_at is not None
