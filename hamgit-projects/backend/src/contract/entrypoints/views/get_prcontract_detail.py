from account.domain.entities.user import User
from contract.domain.prcontract import MonthlyRentService, PRContractService
from core.exceptions import ValidationException
from unit_of_work import UnitOfWork


def get_prcontract_detail_view(
    contract_id: int,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
    monthly_rent_service: MonthlyRentService,
) -> dict:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        contract = uow.contracts.get_or_raise(id=contract_id)

        if not user.is_admin and contract.created_by != user.id:
            uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)

        steps = uow.contract_steps.get_by_contract_id(contract_id)

        completed_steps = [step.type for step in steps]

        state = prc_service.get_contract_state(
            completed_steps=completed_steps,
            contract_status=prcontract.status,
            owner_party_type=prcontract.owner_party_type,
        )

        try:
            total_rent_amount = monthly_rent_service.calculate_total_rent(prcontract)
        except ValidationException:
            total_rent_amount = None

        return prcontract.dumps(state=state, total_rent_amount=total_rent_amount, password=contract.password)
