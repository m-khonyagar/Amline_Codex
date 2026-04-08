import datetime as dt
from typing import Optional

from contract.domain.entities import ContractPayment
from contract.domain.enums import PartyType, PaymentMethod, PaymentType
from contract.domain.prcontract import PRContractCommissionService
from core.abstracts.invoice_service import AbstractInvoiceService
from core.dtos import GenerateInvoiceDto, InvoiceItemDto
from core.enums import BaseInvoiceItemType
from core.exceptions import NotFoundException, ProcessingException
from core.logger import Logger
from core.translates import not_found_trans, processing_trans
from unit_of_work import UnitOfWork


def admin_generate_prcontract_commissions_handler(
    contract_id: int,
    uow: UnitOfWork,
    invoice_service: AbstractInvoiceService,
    commission_service: PRContractCommissionService,
    logger: Optional[Logger] = None,
):
    try:
        with uow:
            prc = uow.prcontracts.get_by_contract_id(contract_id)

            if not prc:
                if logger:
                    logger.error(f"[prcontract not found] contract_id={contract_id}")
                    return
                else:
                    raise NotFoundException(not_found_trans.PropertyRentContract)

            tenant = uow.contract_parties.get(contract_id=contract_id, party_type=PartyType.TENANT)
            if not tenant:
                if logger:
                    logger.error(f"[tenant not found] contract_id={contract_id}")
                    return
                else:
                    raise NotFoundException(not_found_trans.tenant_not_found)

            landlord = uow.contract_parties.get(contract_id=contract_id, party_type=PartyType.LANDLORD)
            if not landlord:
                if logger:
                    logger.error(f"[landlord not found] contract_id={contract_id}")
                    return
                else:
                    raise NotFoundException(not_found_trans.landlord_not_found)

            if not prc.rent_amount or not prc.deposit_amount:
                if logger:
                    logger.error(f"[monthly_rent_amount or deposit_amount not set] contract_id={contract_id}")
                    return
                else:
                    raise ProcessingException(processing_trans.monthly_rent_amount_or_deposit_amount_not_set)

            commission_amount = commission_service.calculate_commission(
                rent_amount=prc.rent_amount,
                deposit_amount=prc.deposit_amount,
            )

            tax = commission_service.calculate_tax(commission_amount)

            tax_item = InvoiceItemDto(amount=tax, type=BaseInvoiceItemType.TAX)

            total_commission = commission_amount + tax

            # creating tenant commission invoice

            tenant_invoice = invoice_service.generate_invoice(
                GenerateInvoiceDto(
                    amount=commission_amount,
                    payer_user_id=tenant.user_id,
                    payee_user_id=commission_service.amline_user_id,
                    created_by=commission_service.amline_user_id,
                    items=[tax_item],
                )
            )

            if logger:
                logger.info(f"[tenant commission invoice generated] contract_id={contract_id}")

            # creating tenant commission payment
            tenant_payment = ContractPayment(
                contract_id=contract_id,
                invoice_id=tenant_invoice.id,
                amount=total_commission,
                payer_id=tenant.user_id,
                payee_id=commission_service.amline_user_id,
                owner_id=commission_service.amline_user_id,
                type=PaymentType.COMMISSION,
                method=PaymentMethod.CASH,
                due_date=dt.date.today(),
            )
            uow.contract_payments.add(tenant_payment)

            if logger:
                logger.info(f"[tenant commission payment generated] payment_id={tenant_payment.id}")

            # creating landlord commission invoice
            landlord_invoice = invoice_service.generate_invoice(
                GenerateInvoiceDto(
                    amount=commission_amount,
                    payer_user_id=landlord.user_id,
                    payee_user_id=commission_service.amline_user_id,
                    created_by=commission_service.amline_user_id,
                    items=[tax_item],
                )
            )
            if logger:
                logger.info(f"[landlord commission invoice generated] contract_id={contract_id}")

            # creating landlord commission payment
            landlord_payment = ContractPayment(
                contract_id=contract_id,
                invoice_id=landlord_invoice.id,
                amount=total_commission,
                payer_id=landlord.user_id,
                payee_id=commission_service.amline_user_id,
                owner_id=commission_service.amline_user_id,
                type=PaymentType.COMMISSION,
                method=PaymentMethod.CASH,
                due_date=dt.date.today(),
            )
            uow.contract_payments.add(landlord_payment)

            if logger:
                logger.info(f"[landlord commission payment generated] payment_id={landlord_payment.id}")

            uow.commit()

    except Exception as error:
        if logger:
            logger.error(f"[commission generation failed] contract_id={contract_id}", error)
        else:
            raise error
