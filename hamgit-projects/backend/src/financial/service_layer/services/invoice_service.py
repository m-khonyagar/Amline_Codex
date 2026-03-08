from datetime import datetime

from contract.domain.enums import PaymentType
from core.abstracts.invoice_service import AbstractInvoiceService
from core.dtos import GenerateInvoiceDto, InvoiceDto
from core.enums import BaseInvoiceItemType
from core.helpers import get_now
from financial.domain.entities.invoice import Invoice
from financial.domain.entities.invoice_items import InvoiceItem
from financial.domain.enums import InvoiceStatus
from unit_of_work import UnitOfWork


class InvoiceService(AbstractInvoiceService):
    def __init__(self, uow: UnitOfWork) -> None:
        self.uow = uow

    def get_invoice_by_id(self, invoice_id: int, type: PaymentType | None = None) -> dict:
        invoice = self.uow.invoices.get_or_raise(id=invoice_id)
        return invoice.dumps(category=type) if type else invoice.dumps()

    def generate_invoice(self, data: GenerateInvoiceDto) -> InvoiceDto:
        invoice = Invoice.create(
            data.payer_user_id,
            data.payee_user_id,
            data.amount,
            data.created_by,
        )
        if data.items:
            invoice_items = []
            for item in data.items:
                invoice_items.append(self._generate_invoice_item(invoice.id, item.type, item.amount))
            invoice.items = invoice_items

        self.uow.invoices.add(invoice)

        if data.paid_commissions:
            invoice.status = InvoiceStatus.PAID
            invoice.paid_at = get_now()

        self.uow.flush()
        return InvoiceDto(id=invoice.id, final_amount=invoice.final_amount, paid_at=invoice.paid_at)

    def delete_invoice(self, invoice_id: int) -> None:
        invoice = self.uow.invoices.get(id=invoice_id)
        if invoice:
            invoice.soft_delete()
            self.uow.flush()

    def bulk_generate_invoices(self, data_list: list[GenerateInvoiceDto]) -> list[InvoiceDto]:
        return [self.generate_invoice(data) for data in data_list]

    def convert_wallet_credit_to_invoice_item(self, invoice_id: int, amount: int) -> InvoiceItem:
        invoice_item = self._generate_invoice_item(invoice_id, BaseInvoiceItemType.WALLET_CREDIT, (amount * -1))
        return invoice_item

    def change_invoice_status(self, invoice_id: int, status: InvoiceStatus) -> Invoice:
        invoice = self.uow.invoices.get_or_raise(id=invoice_id)
        invoice.status = status
        return invoice

    def _generate_invoice_item(self, invoice_id: int, type: BaseInvoiceItemType, amount: int) -> InvoiceItem:
        invoice_item = InvoiceItem.create(invoice_id=invoice_id, type=type, amount=amount)
        self.uow.invoice_items.add(invoice_item)
        return invoice_item

    def mark_invoice_as_paid(self, invoice_id: int, paid_at: datetime | None) -> dict:
        invoice = self.uow.invoices.get_or_raise(id=invoice_id)
        invoice.mark_as_paid(paid_at or get_now())
        self.uow.flush()
        self.uow.invoices.refresh(invoice)
        return invoice.dumps()
