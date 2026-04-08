from dataclasses import dataclass

from fastapi import BackgroundTasks

from contract.domain.enums import PaymentType
from core import settings
from core.dtos import InvoiceDto
from core.exceptions import PermissionException
from core.helpers import get_now
from core.logger import Logger
from core.translates import perm_trans
from core.types import CurrentUser
from financial.domain.entities.invoice import Invoice
from financial.domain.entities.transaction import Transaction
from financial.domain.enums import BankGateWay, InvoiceStatus, TransactionStatus
from financial.service_layer.dtos import MessageToUserDto, PayInvoiceDto
from financial.service_layer.event_handlers.transaction_success import (
    transaction_success_event_handler,
)
from financial.service_layer.event_handlers.wallet_transactions_verifier import (
    handle_stale_wallet_transactions,
)
from financial.service_layer.events import TransactionStatusEvent
from financial.service_layer.services.parsian_service import ParsianService
from financial.service_layer.services.wallet_service import WalletService
from financial.service_layer.services.zarinpal_service import ZarinpalService
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork

logger = Logger("Pay_Service")


@dataclass
class BankGateWayVariable:
    value: BankGateWay = BankGateWay.ZARINPAL


last_gateway = BankGateWayVariable()

payment_translate = {
    PaymentType.RENT: "قسط اجاره",
    PaymentType.DEPOSIT: "قسط رهن",
    PaymentType.COMMISSION: "کمیسیون",
    PaymentType.ERNEST_MONEY: "پیش پرداخت",
}


def pay_contract_invoice_handler(
    command: PayInvoiceDto, uow: UnitOfWork, bg_tasks: BackgroundTasks, current_user: CurrentUser
) -> str:
    with uow:
        invoice = uow.invoices.get_or_raise(id=command.invoice_id)
        _validate_invoice_access(uow, invoice, current_user)

        # TEMP: to fix error with paying with wallet for invoice amount with zero final amount
        invoice_amount = invoice.calculate_final_amount()
        payment = uow.contract_payments.get_or_raise(invoice_id=invoice.id)
        if (
            (command.use_wallet_credit or command.use_all_wallet_credits)
            and (payment.type != PaymentType.WALLET_CHARGE)
            and (invoice_amount > 0)
        ):
            handle_stale_wallet_transactions()
            _process_wallet_payment(command, invoice, uow, current_user)

        invoice_amount = invoice.calculate_final_amount()
        transaction = _create_transaction(command, invoice_amount)

        if invoice_amount == 0:
            purchase_url = _process_zero_amount_payment(transaction, invoice, bg_tasks)
        else:
            purchase_url = _process_gateway_payment(command.bank_gateway, transaction, current_user)

        transaction.invoice = invoice
        uow.transactions.add(transaction)

        uow.commit()

        return purchase_url


def pay_contract_invoice_message_to_user_handler(
    command: MessageToUserDto,
    uow: UnitOfWork,
    sms_service: SMSService,
) -> None:
    with uow:

        payment = uow.contract_payments.get_or_raise(invoice_id=command.invoice_id)
        invoice = uow.invoices.get_or_raise(id=command.invoice_id)
        payer = uow.users.get_or_raise(id=payment.payer_id)

        sms_service.send_invoice_link(
            mobile=command.mobile or payer.mobile,
            payment_type=payment_translate.get(payment.type, "پرداخت"),
            link=command.link,
            amount=f"{invoice.final_amount:,}",
        )


def _validate_invoice_access(uow: UnitOfWork, invoice: Invoice, current_user: CurrentUser) -> None:
    if invoice.status == InvoiceStatus.PAID:
        raise PermissionException(perm_trans.invoice_already_paid)
    if current_user.id != invoice.payer_user_id and not current_user.is_admin:
        raise PermissionException(perm_trans.access_denied)
    if uow.transactions.get(invoice_id=invoice.id, status=TransactionStatus.SUCCESS):
        raise PermissionException(perm_trans.invoice_already_paid)


def _process_wallet_payment(
    command: PayInvoiceDto,
    invoice: Invoice,
    uow: UnitOfWork,
    current_user: CurrentUser,
) -> None:

    credits = invoice.calculate_final_amount() if command.use_all_wallet_credits else command.wallet_credits
    WalletService(uow, current_user.id).pay_with_credits(command.invoice_id, credits or 0)
    uow.invoices.refresh(invoice)


def _create_transaction(command: PayInvoiceDto, amount: int) -> Transaction:
    return Transaction.create(
        invoice_id=command.invoice_id,
        gateway=command.bank_gateway,
        amount=amount,
        status=TransactionStatus.PENDING,
    )


def _process_zero_amount_payment(transaction: Transaction, invoice: Invoice, bg_tasks: BackgroundTasks) -> str:
    invoice.paid_at = get_now()
    transaction.verified_at = get_now()
    invoice.status = InvoiceStatus.PAID
    transaction.status = TransactionStatus.SUCCESS

    bg_tasks.add_task(
        transaction_success_event_handler,
        event=TransactionStatusEvent(InvoiceDto(invoice.id, invoice.final_amount, get_now())),
    )

    purchase_url = f"{settings.BANK_GATEWAY_REDIRECT_URL}?invoice_id={transaction.invoice_id}&success=True"
    return purchase_url


def _process_gateway_payment(bank_gateway: BankGateWay, transaction: Transaction, current_user: CurrentUser) -> str:
    if bank_gateway == BankGateWay.ZARINPAL:
        return ZarinpalService().get_purchase_url(transaction, current_user)
    if bank_gateway == BankGateWay.PARSIAN:
        try:
            purchase_link = ParsianService().get_purchase_url(transaction)
            if not purchase_link:
                raise Exception("Failed to generate Parsian bank URL")
        except Exception as e:
            logger.error(f"Error generating Parsian bank URL: {str(e)}")
            purchase_link = ZarinpalService().get_purchase_url(transaction, current_user)
        return purchase_link
    return ""
