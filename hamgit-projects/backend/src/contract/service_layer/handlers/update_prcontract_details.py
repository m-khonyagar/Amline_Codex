"""ADMIN ROUTE HANDLER"""

from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import ContractStatus, PaymentType, PRContractStep
from contract.service_layer.dtos import UpdatePRContractDatesAndAmountsDto
from contract.service_layer.exceptions import ContractIsNotEditableException
from core.abstracts.invoice_service import AbstractInvoiceService
from unit_of_work import UnitOfWork


def update_prcontract_details_handler(
    contract_id: int, data: UpdatePRContractDatesAndAmountsDto, uow: UnitOfWork, invoice_service: AbstractInvoiceService
) -> PropertyRentContract:
    with uow:
        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)

        if prc.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
            raise ContractIsNotEditableException

        # admin needed to change contract details after signing
        # parties_signed_contract = uow.contract_steps.get_by_contract_id_and_types(
        #     contract_id, [PRContractStep.TENANT_SIGNATURE, PRContractStep.LANDLORD_SIGNATURE]
        # )
        # if parties_signed_contract:
        #     raise ProcessingException(ProcessingExcTrans.contract_cannot_changes_after_signing)

        steps_to_revoke = set()
        remove_commission_payments = False
        payments_to_delete: list[ContractPayment] = []

        # check if rent amount or dates have changed
        if data.start_date or data.end_date or data.rent_amount is not None:
            if (
                data.start_date or prc.start_date,
                data.end_date or prc.end_date,
                data.rent_amount or prc.rent_amount,
            ) != (prc.start_date, prc.end_date, prc.rent_amount):
                steps_to_revoke.add(PRContractStep.RENT_PAYMENT)
                remove_commission_payments = True
                payments_to_delete.extend(
                    uow.contract_payments.get_by_contract_id(contract_id, payment_type=PaymentType.RENT)
                )

        # check if deposit amount has changed
        if data.deposit_amount is not None and data.deposit_amount != prc.deposit_amount:
            remove_commission_payments = True
            steps_to_revoke.add(PRContractStep.DEPOSIT_PAYMENT)
            payments_to_delete.extend(
                uow.contract_payments.get_by_contract_id(contract_id, payment_type=PaymentType.DEPOSIT)
            )

        for step in steps_to_revoke:
            uow.contract_steps.revoke_step_if_exists(contract_id, step)

        if remove_commission_payments:
            payments_to_delete.extend(
                [
                    p
                    for p in uow.contract_payments.get_by_contract_id(contract_id, payment_type=PaymentType.COMMISSION)
                    if p.paid_at is None
                ]
            )

        for payment in payments_to_delete:
            payment.delete()
            if payment.invoice_id:
                invoice_service.delete_invoice(payment.invoice_id)

        dict_data = {k: v for k, v in data.dumps().items() if v is not None}

        prc.update(**dict_data)

        if (
            prc.start_date
            and prc.end_date
            and prc.property_handover_date
            and prc.landlord_penalty_fee
            and prc.tenant_penalty_fee
        ):
            uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.DATES_AND_PENALTIES)

        if prc.deposit_amount:
            uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.DEPOSIT)

        if prc.rent_amount:
            uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.MONTHLY_RENT)

        uow.commit()
        uow.prcontracts.refresh(prc)
        return prc
