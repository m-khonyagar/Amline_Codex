from logging import Logger

from sqlalchemy import text

import di
from financial.domain.enums import InvoiceItemType, WalletTransactionCategory
from financial.service_layer.services.wallet_service import WalletService
from unit_of_work import SQLAlchemyUnitOfWork

logger = Logger(__name__)


def handle_stale_wallet_transactions():
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    try:
        with uow:
            raw_query = """
            SELECT DISTINCT wt.id
            FROM financial.wallet_transactions AS wt
            WHERE wt.amount < 0
            AND wt.created_at < NOW() - INTERVAL '20 minutes'
            AND wt.invoice_id NOT IN (
                SELECT bt.invoice_id
                FROM financial.transactions AS bt
                WHERE bt.status IN ('SUCCESS', 'FAILED')
            )
            AND wt.invoice_id IN (
                SELECT DISTINCT bt.invoice_id
                FROM financial.transactions AS bt
                WHERE bt.status NOT IN ('SUCCESS', 'FAILED')
            );
            """
            query = text(raw_query)

            if result := uow.session.execute(query).fetchall():
                for transaction_id in result:
                    transaction = uow.wallet_transactions.get_or_raise(id=transaction_id[0])
                    user_wallet = uow.wallets.get_or_raise(id=transaction.wallet_id)
                    WalletService(uow, user_wallet.user_id).add_credits(
                        abs(transaction.amount), WalletTransactionCategory.REFUND, transaction.invoice_id
                    )
                    associated_invoice_item = uow.invoice_items.get_or_raise(
                        invoice_id=transaction.invoice_id, type=InvoiceItemType.WALLET_CREDIT
                    )
                    associated_invoice_item.soft_delete()
                uow.commit()
                print(f"{len(result)} stale wallet transactions restored")
                print(f"restored wallet transaction ids: {[t for t in result]}")

    except Exception as error:
        logger.error(error)
        uow.rollback()
