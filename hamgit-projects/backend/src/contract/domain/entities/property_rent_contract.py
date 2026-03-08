import datetime as dt

from contract.domain import enums
from contract.domain.entities.contract import Contract
from contract.domain.entities.contract_step import ContractStep
from contract.domain.types import ContractOwner, TrackingCode
from core.base.base_entity import BaseEntity
from core.exceptions import ValidationException
from core.translates.validation_exception import ValidationExcTrans


class PropertyRentContract(BaseEntity):
    id: int

    # Contract
    contract_id: int
    owner_user_id: int
    status: enums.ContractStatus
    pdf_file_id: int | None

    property_id: int | None
    is_guaranteed: bool
    owner_party_type: enums.PartyType

    # Rent details
    date: dt.date | None
    property_handover_date: dt.date | None
    start_date: dt.date | None
    end_date: dt.date | None
    deposit_amount: int | None
    rent_amount: int | None
    rent_day: int | None

    # tenant info
    tenant_bank_account_id: int | None
    tenant_penalty_fee: int | None
    tenant_family_members_count: int | None

    # landlord info
    landlord_rent_bank_account_id: int | None
    landlord_deposit_bank_account_id: int | None
    landlord_penalty_fee: int | None

    # Tracking code
    tracking_code_status: enums.TrackingCodeStatus
    tracking_code_value: str | None
    tracking_code_generation_date: dt.date | None

    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    steps: list[ContractStep]
    state: enums.PRContractState
    total_rent_amount: int | None = None

    color: enums.ContractColor | None

    def __init__(
        self,
        contract_id: int,
        owner_user_id: int,
        owner_party_type: enums.PartyType,
        status: enums.ContractStatus = enums.ContractStatus.DRAFT,
        pdf_file_id: int | None = None,
        date: dt.date | None = None,
        is_guaranteed: bool = False,
        property_id: int | None = None,
        property_handover_date: dt.date | None = None,
        start_date: dt.date | None = None,
        end_date: dt.date | None = None,
        deposit_amount: int | None = None,
        rent_amount: int | None = None,
        rent_day: int | None = None,
        tenant_bank_account_id: int | None = None,
        tenant_penalty_fee: int | None = None,
        tenant_family_members_count: int | None = None,
        landlord_rent_bank_account_id: int | None = None,
        landlord_deposit_bank_account_id: int | None = None,
        landlord_penalty_fee: int | None = None,
    ):
        self.id = self.next_id
        self.contract_id = contract_id
        self.owner_user_id = owner_user_id
        self.owner_party_type = owner_party_type
        self.status = status
        self.date = date
        self.pdf_file_id = pdf_file_id
        self.is_guaranteed = is_guaranteed
        self.property_id = property_id
        self.property_handover_date = property_handover_date
        self.start_date = start_date
        self.end_date = end_date
        self.deposit_amount = deposit_amount
        self.rent_amount = rent_amount
        self.rent_day = rent_day
        self.tenant_bank_account_id = tenant_bank_account_id
        self.tenant_penalty_fee = tenant_penalty_fee
        self.tenant_family_members_count = tenant_family_members_count
        self.landlord_rent_bank_account_id = landlord_rent_bank_account_id
        self.landlord_deposit_bank_account_id = landlord_deposit_bank_account_id
        self.landlord_penalty_fee = landlord_penalty_fee
        self.tracking_code_status = enums.TrackingCodeStatus.NOT_GENERATED

    def update(
        self,
        date: dt.date | None = None,
        tenant_penalty_fee: int | None = None,
        landlord_penalty_fee: int | None = None,
        property_handover_date: dt.date | None = None,
        start_date: dt.date | None = None,
        end_date: dt.date | None = None,
        deposit_amount: int | None = None,
        rent_amount: int | None = None,
        rent_day: int | None = None,
        tenant_family_members_count: int | None = None,
    ) -> None:
        self.date = date or self.date
        self.tenant_penalty_fee = tenant_penalty_fee or self.tenant_penalty_fee
        self.landlord_penalty_fee = landlord_penalty_fee or self.landlord_penalty_fee
        self.property_handover_date = property_handover_date or self.property_handover_date
        self.start_date = start_date or self.start_date
        self.end_date = end_date or self.end_date
        self.deposit_amount = deposit_amount or self.deposit_amount
        self.rent_amount = rent_amount or self.rent_amount
        self.rent_day = rent_day or self.rent_day
        self.tenant_family_members_count = tenant_family_members_count or self.tenant_family_members_count

    @property
    def tracking_code(self) -> TrackingCode:
        return TrackingCode(
            status=self.tracking_code_status,
            value=self.tracking_code_value,
            generation_date=self.tracking_code_generation_date,
        )

    @tracking_code.setter
    def tracking_code(self, tracking_code: TrackingCode) -> None:
        if tracking_code.status == enums.TrackingCodeStatus.DELIVERED and not tracking_code.value:
            raise ValidationException(ValidationExcTrans.tracking_code_value_cannot_be_null)
        if tracking_code.status == enums.TrackingCodeStatus.DELIVERED:
            self.tracking_code_status = tracking_code.status
            self.tracking_code_value = tracking_code.value
            self.tracking_code_generation_date = tracking_code.generation_date or dt.date.today()
        else:
            self.tracking_code_status = tracking_code.status
            self.tracking_code_value = None
            self.tracking_code_generation_date = None

    @property
    def owner(self) -> ContractOwner:
        return ContractOwner(user_id=self.owner_user_id, party_type=self.owner_party_type)

    @property
    def counter_party_type(self) -> enums.PartyType:
        return enums.PartyType.LANDLORD if self.owner_party_type == enums.PartyType.TENANT else enums.PartyType.TENANT

    def add_property(self, property_id: int) -> None:
        self.property_id = property_id

    def add_tenant_family_members_count(self, tenant_family_members_count: int) -> None:
        self.tenant_family_members_count = tenant_family_members_count

    def add_tenant_bank_account(self, tenant_bank_account_id: int) -> None:
        self.tenant_bank_account_id = tenant_bank_account_id

    def add_landlord_rent_bank_account(self, landlord_rent_bank_account_id: int) -> None:
        self.landlord_rent_bank_account_id = landlord_rent_bank_account_id

    def add_landlord_deposit_bank_account(self, landlord_deposit_bank_account_id: int) -> None:
        self.landlord_deposit_bank_account_id = landlord_deposit_bank_account_id

    def update_contract(self, contract: Contract) -> None:
        self.contract_id = contract.id
        self.owner_user_id = contract.owner_user_id
        self.status = contract.status
        self.pdf_file_id = contract.pdf_file_id

    def dumps(self, **kwargs) -> dict:
        return dict(
            contract=kwargs.pop(
                "contract",
                {
                    "id": str(self.contract_id),
                    "type": enums.ContractType.PROPERTY_RENT,
                    "owner": self.owner.dumps(),
                    "status": self.status,
                    "date": self.date,
                    "pdf_file": {"id": str(self.pdf_file_id)} if self.pdf_file_id else None,
                },
            ),
            property=kwargs.pop("property", {"id": str(self.property_id)}) if self.property_id else None,
            is_guaranteed=self.is_guaranteed,
            property_handover_date=self.property_handover_date,
            start_date=self.start_date,
            end_date=self.end_date,
            deposit_amount=self.deposit_amount,
            monthly_rent_amount=self.rent_amount,
            rent_day=self.rent_day,
            tenant_family_members_count=self.tenant_family_members_count,
            tenant_bank_account=(
                kwargs.pop("tenant_bank_account", {"id": str(self.tenant_bank_account_id)})
                if self.tenant_bank_account_id
                else None
            ),
            tenant_penalty_fee=self.tenant_penalty_fee,
            landlord_rent_bank_account=(
                kwargs.pop("landlord_rent_bank_account", {"id": str(self.landlord_rent_bank_account_id)})
                if self.landlord_rent_bank_account_id
                else None
            ),
            landlord_deposit_bank_account=(
                kwargs.pop(
                    "landlord_deposit_bank_account",
                    {"id": str(self.landlord_deposit_bank_account_id)},
                )
                if self.landlord_deposit_bank_account_id
                else None
            ),
            landlord_penalty_fee=self.landlord_penalty_fee,
            total_rent_amount=kwargs.pop("total_rent_amount", self.total_rent_amount),
            tracking_code=self.tracking_code.dumps(),
            **kwargs,
        )
