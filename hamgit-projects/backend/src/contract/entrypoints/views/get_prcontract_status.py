from datetime import datetime

from account.domain.entities import User
from contract.domain import enums
from contract.domain.prcontract import PRContractService
from unit_of_work import UnitOfWork


def get_prcontract_status_view(contract_id: int, user: User, uow: UnitOfWork, prc_service: PRContractService) -> dict:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        if not user.is_admin and contract.created_by != user.id:
            party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        else:
            party = uow.contract_parties.get_by_contract_id_and_user(contract_id, user)

        contract_steps = uow.contract_steps.get_contract_completed_steps(prcontract.contract_id)

        steps_status: dict[enums.PRContractStep, datetime | None] = dict()

        for step in contract_steps:
            steps_status[enums.PRContractStep.resolve(step.type)] = step.completed_at

        for step_type in enums.PRContractStep:
            if step_type not in steps_status:
                steps_status[step_type] = None

        state = prc_service.get_contract_state(
            completed_steps=[step.type for step in contract_steps],
            contract_status=prcontract.status,
            owner_party_type=prcontract.owner_party_type,
        )

        return dict(
            current_user_party_type=party.party_type if party else prcontract.owner_party_type,
            owner_party_type=prcontract.owner.party_type,
            contract_status=prcontract.status,
            state=state,
            steps=steps_status,
            key=str(contract.id),
            password=contract.password or None,
        )
