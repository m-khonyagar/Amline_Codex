import datetime as dt
from dataclasses import dataclass

from core.base.base_event import BaseEvent


@dataclass
class TenantSignedContractEvent(BaseEvent):
    contract_id: int


@dataclass
class ContractPaymentsCompletedEvent(BaseEvent):
    contract_id: int


@dataclass
class InvoicePayedEvent(BaseEvent):
    invoice_id: int
    paid_at: dt.datetime
