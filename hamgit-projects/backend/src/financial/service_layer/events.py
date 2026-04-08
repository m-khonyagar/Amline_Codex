import dataclasses as dc

from contract.domain.entities.property_rent_contract import PropertyRentContract
from core.base.base_event import BaseEvent
from core.dtos import InvoiceDto


@dc.dataclass
class GenerateCommissionInvoicesEvent(BaseEvent):
    user_id: int
    pr_contract: PropertyRentContract


@dc.dataclass
class TransactionStatusEvent(BaseEvent):
    invoice: InvoiceDto


@dc.dataclass
class SendWalletChargeMessageEvent(BaseEvent):
    mobile: str
    charged_amount: str
    wallet_credit: str
    custom_message: str | None = None
