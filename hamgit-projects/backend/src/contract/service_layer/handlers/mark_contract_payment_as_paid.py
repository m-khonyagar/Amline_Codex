from contract.domain.entities.contract_step import ContractStep
from contract.domain.enums import ContractStatus, PRContractStep
from contract.domain.prcontract.steps_mapper import PARTY_COMMISSION_STEP_MAPPER
from core.abstracts.invoice_service import AbstractInvoiceService
from core.exceptions import NotFoundException, ProcessingException
from core.logger import Logger
from core.translates.not_found_exception import NotFoundExcTrans
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork

logger = Logger("mark_commission_as_paid")


def mark_contract_payment_as_paid_handler(
    contract_id: int, payment_id: int, uow: UnitOfWork, invoice_service: AbstractInvoiceService
) -> None:
    with uow:
        check_perm(uow.contract_steps.get_contract_completed_steps(contract_id))
        payment = uow.contract_payments.get_or_raise(id=payment_id, contract_id=contract_id)
        # TEMP: temporarily disabled to avoid change in the actual payment and just pass the step
        # payment.mark_as_paid(paid_at=get_now())

        payer = uow.users.get_or_raise(id=payment.payer_id)

        party = uow.contract_parties.get_by_contract_id_and_user(contract_id=contract_id, user=payer)
        if not party:
            raise NotFoundException(NotFoundExcTrans.ContractParty)

        step = PARTY_COMMISSION_STEP_MAPPER[party.party_type]
        uow.contract_steps.add_step(contract_id, step)
        uow.flush()

        contract_steps = uow.contract_steps.get_by_contract_id_and_types(
            payment.contract_id, [PRContractStep.TENANT_COMMISSION, PRContractStep.LANDLORD_COMMISSION]
        )

        if len(contract_steps) == 2:
            contract = uow.contracts.get_or_raise(id=payment.contract_id)
            prc = uow.prcontracts.get_by_contract_id_or_raise(payment.contract_id)
            contract.update_status(ContractStatus.PENDING_ADMIN_APPROVAL)
            prc.update_contract(contract)

        # TEMP: temporarily disabled to avoid change in the actual payment and just pass the step
        # try:

        #     if payment.invoice_id:
        #         invoice_service.mark_invoice_as_paid(payment.invoice_id, payment.paid_at)
        # except Exception as exc:
        #     logger.error("Error while marking invoice as paid", exc)
        #     uow.rollback()
        #     raise ProcessingException("Error while marking invoice as paid")

        uow.commit()


# FIXME => Move this function to prc-service
def check_perm(completed_steps: list[ContractStep]) -> None:
    steps = {PRContractStep.resolve(step.type) for step in completed_steps}

    required_steps = {
        PRContractStep.DATES_AND_PENALTIES,
        PRContractStep.MONTHLY_RENT,
        PRContractStep.DEPOSIT,
        PRContractStep.ADD_COUNTER_PARTY,
        PRContractStep.TENANT_INFORMATION,
        PRContractStep.LANDLORD_INFORMATION,
        #
        PRContractStep.RENT_PAYMENT,
        PRContractStep.DEPOSIT_PAYMENT,
        #
        PRContractStep.PROPERTY_DETAILS,
        PRContractStep.PROPERTY_FACILITIES,
        PRContractStep.PROPERTY_SPECIFICATIONS,
        #
        PRContractStep.LANDLORD_SIGNATURE,
        PRContractStep.TENANT_SIGNATURE,
    }

    missing_steps = required_steps - steps

    if missing_steps:
        raise ProcessingException(ProcessingExcTrans.some_steps_are_missing, location=list(missing_steps))
