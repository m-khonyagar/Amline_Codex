import pytest
from sqlalchemy.orm import Session

import di
from core.exceptions import ValidationException
from financial.domain.entities.invoice import Invoice
from financial.domain.enums import WalletTransactionCategory as WTC
from financial.service_layer.services.wallet_service import WalletService
from unit_of_work import SQLAlchemyUnitOfWork


class TestWalletService:

    def setup_method(self) -> None:
        # TODO use mock data
        session: Session = next(di.get_sqlalchemy_session())
        uow = SQLAlchemyUnitOfWork(session)
        with uow:
            self.uow = uow
            self.wallet = uow.wallets.get_random_object()
            self.wallet.credit += 1000
            self.initial_wallet_credit = self.wallet.credit

            self.target_wallet = uow.wallets.get_random_object()
            while self.wallet.id == self.target_wallet.id:
                self.target_wallet = uow.wallets.get_random_object()

            self.target_wallet.credit += 1000
            self.initial_target_wallet_credit = self.target_wallet.credit

            user_a = uow.users.get_or_raise(id=self.wallet.user_id)
            user_b = uow.users.get_or_raise(id=self.target_wallet.user_id)

            self.invoice = Invoice.create(
                payer_user_id=user_a.id, payee_user_id=user_b.id, initial_amount=1000, created_by=user_b.id
            )
            uow.invoices.add(self.invoice)
            uow.flush()
            self.wallet_service = WalletService(uow=uow, user_id=self.wallet.user_id)

    def test_add_credits(self):
        self.wallet_service.add_credits(500, WTC.CREDIT_CHARGE)

        assert self.wallet.credit == self.initial_wallet_credit + 500
        self.initial_wallet_credit += 500

    def test_withdraw_credits(self):
        self.wallet_service.withdraw_credits(500, WTC.WITHDRAW)

        assert self.wallet.credit == self.initial_wallet_credit - 500
        self.initial_wallet_credit -= 500

    def test_withdraw_credits_insufficient_funds(self):
        with pytest.raises(ValidationException, match="Not enough credit"):
            self.wallet_service.withdraw_credits(self.initial_wallet_credit + 1500, WTC.WITHDRAW)

    def test_pay_with_credits(self):
        self.wallet_service.pay_with_credits(invoice_id=self.invoice.id, credit_amount=self.invoice.initial_amount)

        assert self.wallet.credit == self.initial_wallet_credit - self.invoice.initial_amount
        self.initial_wallet_credit -= self.invoice.initial_amount

    def test_transfer_credits(self):
        target_wallet = self.wallet_service.transfer_credits(
            target_user_id=self.target_wallet.user_id, credit_amount=500
        )

        assert self.wallet.credit == self.initial_wallet_credit - 500
        assert self.target_wallet.credit == target_wallet.credit + 500
