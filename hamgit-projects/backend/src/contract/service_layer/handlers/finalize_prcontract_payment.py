"""ADMIN-USER ROUTE HANDLER"""

from account.domain.entities.user import User
from contract.domain.enums import PartyType, PaymentType, PRContractStep
from contract.domain.prcontract import MonthlyRentService, PRContractService
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from contract.service_layer.dtos import FinalizePrContractPaymentDto
from contract.service_layer.exceptions import InvalidActionOrderException
from core.abstracts.invoice_service import AbstractInvoiceService
from core.exceptions import PermissionException, ProcessingException
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork


def finalize_prcontract_payment_handler(
    contract_id: int,
    data: FinalizePrContractPaymentDto,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
    monthly_rent_service: MonthlyRentService,
    invoice_service: AbstractInvoiceService,
) -> bool:
    with uow:
        PAYMENT_TYPE = PaymentType.resolve(data.payment_type)

        STEP = PAYMENT_STEP_MAPPER[PAYMENT_TYPE]

        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)

        if STEP in [step.type for step in contract_steps]:
            raise InvalidActionOrderException(detail=ProcessingExcTrans.payment_already_finalized)

        tenant = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=PartyType.TENANT)
        landlord = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=PartyType.LANDLORD)

        try:
            party = tenant if tenant.user_id == user.id else landlord
            prc_service.validate_party_has_permission_for_step(
                prc=prcontract, party=party, step=STEP, completed_steps=contract_steps
            )
        except PermissionException as exc:
            if not user.is_contract_admin:
                raise exc

            # if prcontract.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
            #     raise ContractIsNotEditRequestedException

        payments = uow.contract_payments.get_by_contract_id(contract_id=contract_id, payment_type=PAYMENT_TYPE)
        payments_sum = sum(payment.amount for payment in payments)

        if PAYMENT_TYPE == PaymentType.DEPOSIT and payments_sum != prcontract.deposit_amount:
            raise ProcessingException(ProcessingExcTrans.deposit_amount_not_match)

        if PAYMENT_TYPE == PaymentType.RENT:
            total_rent_amount = monthly_rent_service.calculate_total_rent(prcontract)
            if payments_sum != total_rent_amount:
                raise ProcessingException(ProcessingExcTrans.rent_amount_not_match)

        # temp solution to prevent multiple commission
        commission_payments = uow.contract_payments.get_by_contract_id(
            contract_id=contract_id, payment_type=PaymentType.COMMISSION
        )
        for payment in commission_payments:
            payment.delete()
            if payment.invoice_id:
                invoice_service.delete_invoice(payment.invoice_id)

        uow.contract_steps.add_step(contract_id, STEP)
        uow.commit()

        payments_steps = uow.contract_steps.get_by_contract_id_and_types(
            contract_id, [PRContractStep.DEPOSIT_PAYMENT, PRContractStep.RENT_PAYMENT]
        )

        # Returns True if both deposit and rent payments are completed, otherwise returns False
        return len(payments_steps) == 2
