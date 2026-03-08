from account.domain.entities.user import User
from contract.adapters.orm.read_only_models.prcontract_rom import PRContractROM
from contract.domain.prcontract.prcontract_service import PRContractService
from core.exceptions import NotFoundException, PermissionException
from core.translates import not_found_trans, perm_trans
from unit_of_work import UnitOfWork


def get_prcontract_preview_view(contract_id: int, user: User, uow: UnitOfWork, prc_service: PRContractService) -> dict:
    with uow:
        prcontract: PRContractROM | None = (
            uow.session.query(PRContractROM)
            .filter(
                PRContractROM.contract_id == contract_id,
                PRContractROM.deleted_at.is_(None),  # type: ignore
            )
            .first()
        )

        if not prcontract:
            raise NotFoundException(not_found_trans.PropertyRentContract)

        parties_user_ids = [party.user_id for party in prcontract.contract.parties]

        if user.id not in parties_user_ids:
            raise PermissionException(perm_trans.user_is_not_contract_party)

        steps = [step for step in prcontract.contract.steps]

        state = prc_service.get_contract_state(
            completed_steps=[step.type for step in steps],
            contract_status=prcontract.contract.status,
            owner_party_type=prcontract.contract.owner_party_type,
        )

        return prcontract.dumps(state=state)
