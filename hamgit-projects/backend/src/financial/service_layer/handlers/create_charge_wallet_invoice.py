import datetime as dt

from contract.domain.entities.contract import Contract
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import (
    ContractStatus,
    ContractType,
    PaymentMethod,
    PaymentType,
)
from core import settings
from core.helpers import get_now
from core.types import CurrentUser
from financial.domain.entities.invoice import Invoice
from unit_of_work import UnitOfWork


def create_charge_wallet_invoice_handler(credit_amount: int, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        invoice = Invoice.create(current_user.id, settings.AMLINE_UID, credit_amount, current_user.id)
        uow.invoices.add(invoice)

        # TODO new type of payment entities must be defined

        contract = Contract(
            owner_user_id=current_user.id,
            status=ContractStatus.ADMIN_STARTED,
            type=ContractType.PROPERTY_RENT,
            created_by=current_user.id,
        )
        contract.deleted_at = get_now()
        uow.contracts.add(contract)

        uow.flush()

        payment = ContractPayment(
            contract_id=contract.id,
            owner_id=current_user.id,
            payer_id=current_user.id,
            payee_id=int(settings.AMLINE_UID),
            amount=credit_amount,
            method=PaymentMethod.CASH,
            type=PaymentType.WALLET_CHARGE,
            due_date=dt.datetime.today(),
            description="wallet charge",
            invoice_id=invoice.id,
        )
        uow.contract_payments.add(payment)

        uow.commit()

        return invoice.dumps()
