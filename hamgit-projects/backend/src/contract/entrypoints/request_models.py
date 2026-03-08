from pydantic import BaseModel

from contract.domain.enums import ClausesType, ContractColor, ContractType, PaymentType
from financial.domain.enums import BankGateWay, ProvinceType


class CalculateRentCommissionRequest(BaseModel):
    security_deposit_amount: int
    rent_amount: int


class CalculateSaleCommissionRequest(BaseModel):
    city: ProvinceType
    sale_price: int


class CreateBaseContractClauseRequest(BaseModel):
    contract_type: ContractType
    clauses_type: ClausesType
    clauses: list


class UpdateBaseContractClauseRequest(BaseModel):
    contract_type: ContractType
    clauses_type: ClausesType
    clauses: list


class CreateCustomInvoiceLinkRequest(BaseModel):
    mobile: str
    amount: int
    gateway: BankGateWay
    type: PaymentType = PaymentType.ERNEST_MONEY


class UpsertContractColorRequest(BaseModel):
    color: ContractColor


class AddPDFFileToContractRequest(BaseModel):
    file_id: int
