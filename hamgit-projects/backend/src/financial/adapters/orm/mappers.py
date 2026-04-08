from sqlalchemy.orm import relationship

from core.database import SQLALCHEMY_REGISTRY
from financial.adapters.orm import data_models as d
from financial.domain.entities.discount import Discount
from financial.domain.entities.invoice import Invoice
from financial.domain.entities.invoice_items import InvoiceItem
from financial.domain.entities.settlement import Settlement
from financial.domain.entities.transaction import Transaction
from financial.domain.entities.wallet import Wallet
from financial.domain.entities.wallet_transaction import WalletTransaction


def start_mappers():

    SQLALCHEMY_REGISTRY.map_imperatively(
        Invoice,
        d.invoices,
        properties={
            "items": relationship(
                "InvoiceItem",
                back_populates="invoice",
                lazy="subquery",
            ),
            "payer": relationship(
                "User",
                primaryjoin="User.id == Invoice.payer_user_id",
                uselist=False,
                lazy="joined",
            ),
            "payee": relationship(
                "User",
                primaryjoin="User.id == Invoice.payee_user_id",
                uselist=False,
                lazy="joined",
            ),
        },
    )

    SQLALCHEMY_REGISTRY.map_imperatively(
        InvoiceItem,
        d.invoice_items,
        properties={
            "invoice": relationship(
                "Invoice",
                back_populates="items",
                viewonly=True,
                uselist=False,
                lazy="noload",
            ),
        },
    )

    SQLALCHEMY_REGISTRY.map_imperatively(
        Transaction,
        d.transactions,
        properties={
            "invoice": relationship(
                "Invoice",
                primaryjoin="Invoice.id == Transaction.invoice_id",
                lazy="joined",
            ),
        },
    )

    SQLALCHEMY_REGISTRY.map_imperatively(
        Settlement,
        d.settlements,
        properties={
            "user": relationship(
                "User",
                primaryjoin="User.id == Settlement.user_id",
                lazy="joined",
            ),
        },
    )

    SQLALCHEMY_REGISTRY.map_imperatively(Discount, d.discounts)
    SQLALCHEMY_REGISTRY.map_imperatively(Wallet, d.wallets)
    SQLALCHEMY_REGISTRY.map_imperatively(WalletTransaction, d.wallet_transactions)
