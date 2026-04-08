"""ADMIN ROUTE HANDLER"""

from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import ContractStatus, PRContractState, PRContractStep
from contract.domain.prcontract.prcontract_service import PRContractService
from core.exceptions import ProcessingException
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork


def refer_prcontract_to_parties_handler(
    contract_id: int, uow: UnitOfWork, prc_service: PRContractService
) -> PropertyRentContract:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        if contract.status != ContractStatus.ADMIN_STARTED:
            raise ProcessingException(ProcessingExcTrans.contract_status_must_be_admin_started)

        completed_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
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
        }

        missing_steps = required_steps - steps

        if missing_steps:
            raise ProcessingException(ProcessingExcTrans.some_steps_are_missing, location=list(missing_steps))

        state = prc_service.get_contract_state(steps, contract.status, prcontract.owner_party_type)
        prcontract.state = state

        if state == PRContractState.PENDING_LANDLORD_SIGNATURE:
            contract.status = ContractStatus.DRAFT
        elif state == PRContractState.PENDING_TENANT_SIGNATURE:
            contract.status = ContractStatus.ACTIVE
        elif state in [
            PRContractState.PENDING_PAYING_COMMISSION,
            PRContractState.PENDING_LANDLORD_COMMISSION,
            PRContractState.PENDING_TENANT_APPROVAL,
        ]:
            contract.status = ContractStatus.PENDING_COMMISSION
        elif state == PRContractState.PENDING_ADMIN_APPROVAL:
            contract.status = ContractStatus.PENDING_ADMIN_APPROVAL

        prcontract.update_contract(contract)
        uow.commit()

        return prcontract
