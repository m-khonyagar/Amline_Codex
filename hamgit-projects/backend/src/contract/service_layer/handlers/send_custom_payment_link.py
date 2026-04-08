import datetime as dt

from account.domain.entities.user import User
from account.domain.enums import UserRole
from contract.domain.entities.contract import Contract
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import ContractStatus, ContractType, PaymentMethod
from contract.entrypoints.request_models import CreateCustomInvoiceLinkRequest
from core import helpers, settings
from core.helpers import get_now
from financial.domain.entities.invoice import Invoice
from financial.domain.entities.transaction import Transaction
from financial.domain.enums import TransactionStatus
from unit_of_work import UnitOfWork


def send_custom_payment_link_handler(
    admin_user: User,
    data: CreateCustomInvoiceLinkRequest,
    uow: UnitOfWork,
) -> dict:

    with uow:
        validated_mobile = helpers.validate_mobile_number(data.mobile)
        user = uow.users.get_by_mobile(validated_mobile)
        if not user:
            user = User(mobile=validated_mobile, roles=[UserRole.PERSON])
            uow.users.add(user)

        invoice = Invoice.create(user.id, settings.AMLINE_UID, data.amount, admin_user.id)
        uow.invoices.add(invoice)

        transaction = Transaction.create(
            amount=data.amount, gateway=data.gateway, invoice_id=invoice.id, status=TransactionStatus.PENDING
        )
        uow.transactions.add(transaction)
        contract = Contract(
            owner_user_id=user.id,
            status=ContractStatus.ADMIN_STARTED,
            type=ContractType.PROPERTY_RENT,
            created_by=admin_user.id,
        )
        contract.deleted_at = get_now()
        uow.contracts.add(contract)
        uow.flush()
        payment = ContractPayment(
            contract_id=contract.id,
            owner_id=user.id,
            payer_id=user.id,
            payee_id=int(settings.AMLINE_UID),
            amount=data.amount,
            method=PaymentMethod.CASH,
            type=data.type,
            due_date=dt.datetime.today(),
            description=f"custom link for {data.type}",
            invoice_id=invoice.id,
        )
        uow.contract_payments.add(payment)

        uow.commit()
        amline_base_url = settings.AMLINE_API_URL
        return {"invoice_id": str(invoice.id), "invoice_link": f"{amline_base_url}financials/cp/{invoice.id}"}
