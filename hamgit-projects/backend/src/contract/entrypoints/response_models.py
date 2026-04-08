import datetime as dt

from pydantic import BaseModel

from account.domain.enums import Gender
from contract.domain import enums
from contract.domain.types import TrackingCode


class ContractOwnerResponse(BaseModel):
    user_id: str
    party_type: enums.PartyType


class ContractPartyResponse(BaseModel):
    id: str
    contract: dict
    user: dict
    party_type: enums.PartyType
    signature_type: enums.SignatureType | None
    signed_at: dt.datetime | None
    is_primary: bool = True


class UserROMResponse(BaseModel):
    id: str
    mobile: str
    national_code: str
    first_name: str | None
    last_name: str | None
    father_name: str | None
    address: str | None


class ContractPartyROMResponse(BaseModel):
    id: str
    party_type: enums.PartyType
    user: UserROMResponse


class ContractResponse(BaseModel):
    id: str
    owner: dict
    type: enums.ContractType
    status: enums.ContractStatus
    pdf_file: dict | None
    parties: list | None = None
    steps: dict[enums.PRContractStep, dt.datetime | None] | None = None
    created_by_user: dict


class ContractStepResponse(BaseModel):
    contract: dict
    name: enums.PRContractStep
    completed_at: dt.datetime | None


class PRContractsResponse(BaseModel):
    class Contract(BaseModel):
        id: str
        owner: ContractOwnerResponse
        type: enums.ContractType
        status: enums.ContractStatus
        date: dt.date | None
        pdf_file: dict | None

    contract: Contract
    property: dict | None
    tenant_bank_account: dict | None
    tenant_penalty_fee: int | None
    landlord_rent_bank_account: dict | None
    landlord_deposit_bank_account: dict | None  # security_deposit_bank_account
    landlord_penalty_fee: int | None
    property_handover_date: dt.date | None
    start_date: dt.date | None
    end_date: dt.date | None
    deposit_amount: int | None  # security_deposit_amount
    monthly_rent_amount: int | None
    total_rent_amount: int | None = None
    tracking_code: TrackingCode
    state: enums.PRContractState | None = None
    steps: dict | None = None
    parties: list | None = None
    key: str | None = None
    password: str | None = None
    tenant_family_members_count: int | None = None


class ContractClauseResponse(BaseModel):
    id: str
    contract: dict
    is_editable: bool
    is_deletable: bool
    clause_name: str
    clause_number: int
    subclause_number: int
    subclause_name: str | None
    body: str


class PRContractStatusResponse(BaseModel):
    current_user_party_type: enums.PartyType
    owner_party_type: enums.PartyType
    contract_status: enums.ContractStatus
    state: enums.PRContractState
    steps: dict[enums.PRContractStep, dt.datetime | None]
    key: str | None = None
    password: str | None = None


class PRContractTenantResponse(BaseModel):
    user: dict
    party: dict
    bank_account: dict | None
    family_members_count: int | None


class PRContractLandlordResponse(BaseModel):
    user: dict
    party: dict
    rent_bank_account: dict
    deposit_bank_account: dict


class PRContractCounterPartyResponse(BaseModel):
    party_type: enums.PartyType | None = None
    mobile: str | None = None
    national_code: str | None = None


class ChequeResponse(BaseModel):
    serial: str
    series: str
    sayaad_code: str
    category: enums.ChequeCategory
    payee_type: enums.ChequePayeeType
    payee_national_code: str
    status: enums.ChequeStatus
    image_file: dict | None = None


class ContractPaymentResponse(BaseModel):
    id: str
    contract: dict
    cheque: ChequeResponse | None
    payer: dict
    payee: dict
    invoice: dict | None
    type: enums.PaymentType
    amount: int
    method: enums.PaymentMethod
    status: enums.PaymentStatus
    due_date: dt.date
    paid_at: dt.datetime | None
    description: str | None
    is_bulk: bool


class UserContractsResponse(BaseModel):

    class Party(BaseModel):
        user_id: str
        party_type: enums.PartyType
        first_name: str | None
        last_name: str | None

    id: str
    state: enums.PRContractState
    status: enums.ContractStatus
    type: enums.ContractType
    # date: dt.date | None
    steps: dict[enums.PRContractStep, dt.datetime | None]
    parties: list[Party]
    current_user_party_type: enums.PartyType
    current_user_is_owner: bool
    owner_party_type: str
    key: str | None = None
    password: str | None = None
    created_at: dt.datetime


class ContractPartyAdminResponse(BaseModel):
    id: str
    party_type: enums.PartyType
    signed_at: dt.datetime | None
    contract: dict
    user: dict
    mobile: str
    first_name: str | None
    last_name: str | None
    father_name: str | None
    birth_date: dt.date | None
    national_code: str | None
    gender: Gender | None
    nick_name: str | None
    postal_code: str | None
    email: str | None
    address: str | None
    is_verified: bool | None
    is_active: bool
    last_login: dt.datetime | None
    bank_accounts: list = []


class PRContractsListResponse(BaseModel):

    class PRC(BaseModel):
        class Party(BaseModel):
            user_id: str
            mobile: str
            party_type: enums.PartyType
            first_name: str | None
            last_name: str | None
            birth_date: dt.date | None
            national_code: str | None

        id: str
        owner_type: enums.PartyType
        status: enums.ContractStatus
        date: dt.date | None
        handover_date: dt.date | None
        start_date: dt.date | None
        end_date: dt.date | None
        deposit: int | None
        rent: int | None
        parties: list[Party]

    total_count: int
    start_index: int
    end_index: int
    data: list[PRC]


class ContractPaymentsSummaryResponse(BaseModel):
    rent_amount: int
    total_rent_amount: int
    total_rent_payments: int
    remaining_rent_amount: int
    rent_finalized: bool
    deposit_amount: int
    total_deposit_payments: int
    remaining_deposit_amount: int | None
    deposit_finalized: bool
