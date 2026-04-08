from logging import Logger

import di
from financial.domain.enums import InvoiceItemType, WalletTransactionCategory
from financial.service_layer.events import TransactionStatusEvent
from financial.service_layer.services.wallet_service import WalletService
from unit_of_work import SQLAlchemyUnitOfWork

logger = Logger(__name__)


def transaction_fail_event_handler(event: TransactionStatusEvent):
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    try:
        with uow:
            invoice = uow.invoices.get_or_raise(id=event.invoice.id)
            if wallet_transaction := uow.wallet_transactions.get(invoice_id=event.invoice.id):
                WalletService(uow, invoice.payer_user_id).add_credits(
                    abs(wallet_transaction.amount), WalletTransactionCategory.REFUND, event.invoice.id
                )
                invoice_item = uow.invoice_items.get_or_raise(
                    invoice_id=event.invoice.id, type=InvoiceItemType.WALLET_CREDIT
                )
                invoice_item.soft_delete()

            if used_dsicount := uow.invoice_items.get(invoice_id=invoice.id, type=InvoiceItemType.DISCOUNT):
                used_dsicount.soft_delete()

            uow.commit()
            logger.info(f"payment failed for invoice_id: {event.invoice.id}")

    except Exception as error:
        logger.error(error)
        logger.error(f"event: {type(event).__name__}")
        uow.rollback()
