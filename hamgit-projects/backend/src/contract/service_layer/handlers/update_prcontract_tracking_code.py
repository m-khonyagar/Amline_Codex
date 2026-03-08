from contract.domain.enums import ContractStatus, PRContractStep, TrackingCodeStatus
from contract.domain.prcontract.steps_mapper import TRACKING_CODE_STEP_MAPPER
from contract.domain.types import TrackingCode
from contract.service_layer.exceptions import InvalidActionOrderException
from unit_of_work import UnitOfWork


def update_prcontract_tracking_code_handler(
    contract_id: int, tracking_code: TrackingCode, uow: UnitOfWork
) -> TrackingCode:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        if contract.status not in [
            ContractStatus.COMPLETED,
            ContractStatus.PDF_GENERATED,
            ContractStatus.PDF_GENERATING_FAILED,
        ]:
            raise InvalidActionOrderException

        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)
        prc.tracking_code = tracking_code
        steps_to_revoke: list[str] = (
            [PRContractStep.TRACKING_CODE_REQUESTED, PRContractStep.TRACKING_CODE_FAILED]
            if tracking_code.status == TrackingCodeStatus.DELIVERED
            else [PRContractStep.TRACKING_CODE_REQUESTED, PRContractStep.TRACKING_CODE_DELIVERED]
        )

        contract_steps = uow.contract_steps.get_by_contract_id_and_types(
            contract_id=contract_id, step_types=steps_to_revoke
        )

        for step in contract_steps:
            step.revoke()

        if to_add := TRACKING_CODE_STEP_MAPPER.get(tracking_code.status):
            uow.contract_steps.add_step(contract_id, to_add)

        uow.commit()
        uow.prcontracts.refresh(prc)
        return tracking_code
