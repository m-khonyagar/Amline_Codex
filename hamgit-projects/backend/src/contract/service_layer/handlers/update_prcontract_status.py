"""ADMIN ROUTE HANDLER"""

from contract.domain.entities.contract import Contract
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import ContractStatus, PRContractStep
from contract.service_layer.dtos import UpdateContractStatusDto
from contract.service_layer.exceptions import InvalidActionOrderException
from core.exceptions import ProcessingException
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork


def update_prcontract_status_handler(
    contract_id: int, data: UpdateContractStatusDto, uow: UnitOfWork
) -> PropertyRentContract:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        status = ContractStatus.resolve(data.status)

        if contract.status == ContractStatus.ADMIN_STARTED:
            completed_steps = uow.contract_steps.get_contract_completed_steps(contract.id)
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
                PRContractStep.TENANT_SIGNATURE,
                PRContractStep.LANDLORD_SIGNATURE,
                PRContractStep.LANDLORD_COMMISSION,
                PRContractStep.TENANT_COMMISSION,
            }
            missing_steps = required_steps - steps

            if missing_steps:
                raise ProcessingException(ProcessingExcTrans.some_steps_are_missing, location=list(missing_steps))

            return handle_pending_admin_approval(contract, prcontract, status, uow)

        if contract.status == ContractStatus.EDIT_REQUESTED:
            return handle_edit_requested(contract, prcontract, status, uow)

        if contract.status == ContractStatus.PENDING_ADMIN_APPROVAL:
            return handle_pending_admin_approval(contract, prcontract, status, uow)

        if contract.status == ContractStatus.ADMIN_REJECTED:
            return handle_admin_rejected(contract, prcontract, status, uow)

        raise InvalidActionOrderException


def handle_edit_requested(
    contract: Contract, prcontract: PropertyRentContract, status: ContractStatus, uow: UnitOfWork
):
    """
    Contract status is EDIT_REQUESTED.
    Back to ACTIVE or Reject contract.
    Allowed statuses: ACTIVE, ADMIN_REJECTED
    Revoke tenant and landlord edit request steps.
    """
    if status not in [ContractStatus.ACTIVE, ContractStatus.ADMIN_REJECTED]:
        raise InvalidActionOrderException

    contract.status = status
    prcontract.update_contract(contract)

    steps_to_revoke = uow.contract_steps.get_by_contract_id_and_types(
        contract.id, [PRContractStep.TENANT_EDIT_REQUEST, PRContractStep.LANDLORD_EDIT_REQUEST]
    )

    for step in steps_to_revoke:
        step.revoke()

    uow.commit()
    uow.prcontracts.refresh(prcontract)
    return prcontract


def handle_pending_admin_approval(
    contract: Contract, prcontract: PropertyRentContract, status: ContractStatus, uow: UnitOfWork
):
    """
    Contract status is PENDING_ADMIN_APPROVAL
    Contract status is ADMIN_STARTED but required steps are completed.

    Reject or Confirm contract.
    Allowed statuses: COMPLETED, ADMIN_REJECTED
    Add admin approve, revoke admin reject, if status is COMPLETED.
    Add admin reject, revoke admin approve, if status is ADMIN_REJECTED.
    """
    if status not in [ContractStatus.ADMIN_REJECTED, ContractStatus.COMPLETED]:
        raise InvalidActionOrderException

    contract.status = status
    prcontract.update_contract(contract)
    status_to_step = {
        ContractStatus.COMPLETED: (PRContractStep.ADMIN_APPROVE, PRContractStep.ADMIN_REJECT),
        ContractStatus.ADMIN_REJECTED: (PRContractStep.ADMIN_REJECT, PRContractStep.ADMIN_APPROVE),
    }

    step_to_add, step_to_revoke = status_to_step[status]
    uow.contract_steps.add_step(contract.id, step_to_add)
    uow.contract_steps.revoke_step_if_exists(contract.id, step_to_revoke)

    uow.commit()
    uow.prcontracts.refresh(prcontract)
    return prcontract


def handle_admin_rejected(
    contract: Contract, prcontract: PropertyRentContract, status: ContractStatus, uow: UnitOfWork
):
    """
    Contract status is ADMIN_REJECTED.
    Back to ACTIVE or Confirm contract.
    Allowed statuses: COMPLETED, ACTIVE
    Remove admin reject step.
    Add admin approve step, if status is ADMIN_APPROVED.
    """
    if status not in [ContractStatus.COMPLETED, ContractStatus.ACTIVE]:
        raise InvalidActionOrderException

    contract.status = status
    prcontract = uow.prcontracts.get_or_raise(contract_id=contract.id)
    prcontract.update_contract(contract)

    uow.contract_steps.revoke_step_if_exists(contract.id, PRContractStep.ADMIN_REJECT)

    if status == ContractStatus.COMPLETED:
        uow.contract_steps.add_step(contract.id, PRContractStep.ADMIN_APPROVE)

    uow.commit()
    uow.prcontracts.refresh(prcontract)
    return prcontract
