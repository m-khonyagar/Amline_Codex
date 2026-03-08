from contract.domain.enums import PaymentType
from core.exceptions import PermissionException
from core.translates import perm_trans
from financial.domain.entities.wallet_transaction import WalletTransaction
from financial.domain.enums import WalletTransactionCategory as WTC
from financial.service_layer.services.invoice_service import InvoiceService
from unit_of_work import UnitOfWork


class WalletService:
    def __init__(self, uow: UnitOfWork, user_id: int) -> None:
        self.uow = uow
        self.wallet = uow.wallets.get_or_raise(user_id=user_id)

    def pay_with_credits(self, invoice_id: int, credit_amount: int) -> None:

        if self.wallet.credit < credit_amount:
            raise PermissionException(perm_trans.insufficient_credit)

        payment = self.uow.contract_payments.get_or_raise(invoice_id=invoice_id)
        self.withdraw_credits(credit_amount, payment.type, invoice_id)
        InvoiceService(self.uow).convert_wallet_credit_to_invoice_item(invoice_id, credit_amount)

    def add_credits(self, amount: int, category: WTC | PaymentType, invoice_id: int | None = None) -> None:
        self.wallet.add_credit(amount)
        self._create_wallet_transaction(self.wallet.id, amount, category, invoice_id)

    def withdraw_credits(self, amount: int, category: str, invoice_id: int | None = None) -> None:
        self.wallet.withdraw_credit(amount)
        self._create_wallet_transaction(self.wallet.id, (amount * -1), category, invoice_id)

    def _create_wallet_transaction(
        self, wallet_id: int, amount: int, category: str, invoice_id: int | None = None
    ) -> None:
        wallet_transaction = WalletTransaction(amount, wallet_id, WTC(category), invoice_id)
        self.uow.wallet_transactions.add(wallet_transaction)
