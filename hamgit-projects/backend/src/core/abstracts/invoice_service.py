from abc import ABC, abstractmethod
from datetime import datetime

from contract.domain.enums import PaymentType
from core.dtos import GenerateInvoiceDto, InvoiceDto


class AbstractInvoiceService(ABC):

    @abstractmethod
    def generate_invoice(self, data: GenerateInvoiceDto) -> InvoiceDto:
        raise NotImplementedError

    @abstractmethod
    def get_invoice_by_id(self, invoice_id: int, type: PaymentType | None = None) -> dict:
        raise NotImplementedError

    @abstractmethod
    def delete_invoice(self, invoice_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    def mark_invoice_as_paid(self, invoice_id: int, paid_at: datetime | None) -> dict:
        raise NotImplementedError

    @abstractmethod
    def bulk_generate_invoices(self, data_list: list[GenerateInvoiceDto]) -> list[InvoiceDto]:
        raise NotImplementedError
