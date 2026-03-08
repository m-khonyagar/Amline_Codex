from abc import ABC, abstractmethod
from datetime import UTC, datetime

from fastapi import BackgroundTasks

from core import settings
from core.dtos import InvoiceDto
from core.exceptions import NotFoundException
from financial.domain.entities.transaction import Transaction
from financial.domain.enums import InvoiceStatus, TransactionStatus
from financial.service_layer.event_handlers.transaction_failed import (
    transaction_fail_event_handler,
)
from financial.service_layer.event_handlers.transaction_success import (
    transaction_success_event_handler,
)
from financial.service_layer.events import TransactionStatusEvent
from financial.service_layer.services.parsian_service import ParsianService
from financial.service_layer.services.zarinpal_service import ZarinpalService


class PaymentStrategy(ABC):
    def __init__(self):
        self.now = datetime.now(UTC)
        self.today = datetime.today().date()
        self.raw_redirect_link = settings.BANK_GATEWAY_REDIRECT_URL

    @abstractmethod
    def verify(self, transaction: Transaction) -> str:
        pass


class PaymentContext:
    def __init__(self, strategy: PaymentStrategy):
        self._strategy = strategy

    def switch_strategy(self, new_strategy: PaymentStrategy):
        self._strategy = new_strategy

    def verify(self, transaction: Transaction) -> str:
        return self._strategy.verify(transaction)


class ZarinpalPropertyContractPayment(PaymentStrategy):
    def __init__(
        self,
        bg_tasks: BackgroundTasks,
    ):
        super().__init__()
        self.bg_tasks = bg_tasks

    def verify(self, transaction: Transaction) -> str:

        if (invoice := transaction.invoice) is None:
            raise NotFoundException("Invoice")

        event = TransactionStatusEvent(InvoiceDto(invoice.id, invoice.final_amount, self.now))

        if transaction.status == TransactionStatus.PENDING:
            is_verified = ZarinpalService().verify(transaction)

            if is_verified["verify"]:
                transaction.status = TransactionStatus.SUCCESS
                transaction.description = str(is_verified["details"])
                transaction.verified_at = self.now

                invoice.status = InvoiceStatus.PAID
                invoice.paid_at = self.now

                redirect_link = f"?invoice_id={transaction.invoice_id}&success={True}"
                self.bg_tasks.add_task(transaction_success_event_handler, event=event)

            else:
                transaction.status = TransactionStatus.FAILED
                transaction.description = str(is_verified["details"])
                redirect_link = f"?invoice_id={transaction.invoice_id}&success={False}"
                self.bg_tasks.add_task(transaction_fail_event_handler, event=event)
        else:
            redirect_link = f"?invoice_id={transaction.invoice_id}&success={False}"
            self.bg_tasks.add_task(transaction_fail_event_handler, event=event)

        return self.raw_redirect_link + redirect_link


class ParsianPropertyContractPayment(PaymentStrategy):
    def __init__(
        self,
        bg_tasks: BackgroundTasks,
    ):
        super().__init__()
        self.bg_tasks = bg_tasks

    def verify(self, transaction: Transaction) -> str:
        if (invoice := transaction.invoice) is None:
            raise NotFoundException("Invoice")

        event = TransactionStatusEvent(InvoiceDto(invoice.id, invoice.final_amount, self.now))

        if transaction.status == TransactionStatus.PENDING:
            is_verified = ParsianService().verify(transaction)

            if is_verified["verify"]:
                transaction.status = TransactionStatus.SUCCESS
                transaction.description = str(is_verified["details"])
                transaction.verified_at = self.now

                invoice.status = InvoiceStatus.PAID
                invoice.paid_at = self.now

                redirect_link = f"?invoice_id={transaction.invoice_id}&success={True}"
                self.bg_tasks.add_task(transaction_success_event_handler, event=event)

            else:
                transaction.status = TransactionStatus.FAILED
                transaction.description = str(is_verified["details"])
                redirect_link = f"?invoice_id={transaction.invoice_id}&success={False}"
                self.bg_tasks.add_task(transaction_fail_event_handler, event=event)
        else:
            redirect_link = f"?invoice_id={transaction.invoice_id}&success={False}"
            self.bg_tasks.add_task(transaction_fail_event_handler, event=event)

        return self.raw_redirect_link + redirect_link
