from sqlalchemy import and_, or_

from account.adapters.orm.read_only_models.bank_account_rom import BankAccountROM
from account.domain.entities.user import User
from contract.adapters.orm.read_only_models import ContractPaymentROM
from contract.domain.enums import (
    PaymentSide,
    PaymentStatus,
    PaymentType,
    PRContractPaymentType,
)
from contract.service_layer.exceptions import UserIsNotContractPartyException
from financial.domain.entities.invoice import Invoice
from financial.domain.entities.invoice_items import InvoiceItem
from financial.domain.enums import InvoiceItemType
from unit_of_work import UnitOfWork


def get_prcontract_payments_list_view(
    contract_id: int,
    prc_payment_type: PRContractPaymentType | None,
    payment_side: PaymentSide | None,
    payment_status: PaymentStatus | None,
    user: User,
    uow: UnitOfWork,
) -> list[dict]:
    with uow:
        payment_type = PaymentType.resolve(prc_payment_type) if prc_payment_type else None
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        # checking if user is contract party if not admin
        if not user.is_contract_admin:
            parties = uow.contract_parties.get_by_contract_id(contract_id=prcontract.contract_id)
            if user.id not in [party.user_id for party in parties]:
                raise UserIsNotContractPartyException

        # main contract payment invoice query
        query = (
            uow.session.query(ContractPaymentROM, Invoice)
            .outerjoin(Invoice, ContractPaymentROM.invoice_id == Invoice.id)
            .filter(
                and_(
                    ContractPaymentROM.contract_id == prcontract.contract_id,  # type: ignore
                    ContractPaymentROM.deleted_at.is_(None),  # type: ignore
                    or_(
                        ContractPaymentROM.payer_id == user.id,  # type: ignore
                        ContractPaymentROM.payee_id == user.id,  # type: ignore
                        user.is_contract_admin,  # type: ignore
                    ),
                )
            )
        )

        # adding filters for payment type and payment side
        if payment_type:
            query = query.filter(ContractPaymentROM.type == payment_type)

        if payment_side:
            if payment_side == PaymentSide.PAYER:
                query = query.filter(ContractPaymentROM.payer_id == user.id)
            else:
                query = query.filter(ContractPaymentROM.payee_id == user.id)

        if payment_status:
            query = query.filter(ContractPaymentROM.status == payment_status)

        # executing query
        query_result: list[tuple[ContractPaymentROM, Invoice | None]] = query.order_by(
            ContractPaymentROM.due_date
        ).all()

        # adding invoice items
        invoice_ids = [invoice.id for _, invoice in query_result if invoice]

        invoice_items: list[InvoiceItem] = (
            uow.session.query(InvoiceItem)
            .filter(and_(InvoiceItem.invoice_id.in_(invoice_ids), InvoiceItem.deleted_at.is_(None)))  # type: ignore
            .all()
        )

        # adding bank accounts
        bank_account_ids = [
            prcontract.tenant_bank_account_id,
            prcontract.landlord_rent_bank_account_id,
            prcontract.landlord_deposit_bank_account_id,
        ]

        bank_accounts: list[BankAccountROM] = (
            uow.session.query(BankAccountROM)
            .filter(BankAccountROM.id.in_(bank_account_ids), BankAccountROM.deleted_at.is_(None))  # type: ignore
            .all()
        )

        bank_accounts_dict = {bank_account.id: bank_account for bank_account in bank_accounts}

        # creating the final result
        payments_list = [
            payment.dumps(
                bank_accounts={
                    "tenant_bank_account": (
                        bank_accounts_dict.get(prcontract.tenant_bank_account_id)
                        if prcontract.tenant_bank_account_id
                        else None
                    ),
                    "landlord_rent_bank_account": (
                        bank_accounts_dict.get(prcontract.landlord_rent_bank_account_id)
                        if prcontract.landlord_rent_bank_account_id
                        else None
                    ),
                    "landlord_deposit_bank_account": (
                        bank_accounts_dict.get(prcontract.landlord_deposit_bank_account_id)
                        if prcontract.landlord_deposit_bank_account_id
                        else None
                    ),
                },
                invoice=(
                    {
                        "id": str(invoice.id),
                        "status": invoice.status,
                        "initial_amount": invoice.initial_amount,
                        "items": [
                            {
                                "id": str(item.id),
                                "extra_info": item.extra_info,
                                "type": item.type,
                                "amount": item.amount,
                            }
                            for item in invoice_items
                            if item.invoice_id == invoice.id and item.type != InvoiceItemType.WALLET_CREDIT
                        ],
                    }
                    if invoice
                    else None
                ),
            )
            for payment, invoice in query_result
        ]
        # TEMP: calculating final amount
        for payment in payments_list:
            if payment["invoice"]:
                payment["invoice"]["final_amount"] = sum(
                    [payment["invoice"]["initial_amount"]] + [item["amount"] for item in payment["invoice"]["items"]]
                )
        return payments_list
