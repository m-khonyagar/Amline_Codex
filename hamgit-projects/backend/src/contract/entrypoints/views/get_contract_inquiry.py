from contract.adapters.orm.read_only_models.prcontract_rom import PRContractROM
from contract.domain.enums import PRContractStep
from contract.domain.prcontract.prcontract_service import PRContractService
from core.exceptions import NotFoundException
from core.translates import not_found_trans
from unit_of_work import UnitOfWork


def inquire_contract_handler(contract_id: int, password: str, uow: UnitOfWork, prc_service: PRContractService) -> dict:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id, password=password)

        prcontract: PRContractROM | None = (
            uow.session.query(PRContractROM)
            .filter(
                PRContractROM.contract_id == contract.id,
                PRContractROM.deleted_at.is_(None),  # type: ignore
            )
            .first()
        )

        if not prcontract:
            raise NotFoundException(not_found_trans.PropertyRentContract)

        steps = [step for step in prcontract.contract.steps]

        if PRContractStep.ADMIN_APPROVE not in [step.type for step in steps]:
            raise NotFoundException(not_found_trans.PropertyRentContract)

        contract_owner_party_type = [
            p.party_type for p in prcontract.contract.parties if p.user_id == prcontract.contract.owner_user_id
        ][0]

        state = prc_service.get_contract_state(
            completed_steps=[step.type for step in steps],
            contract_status=prcontract.contract.status,
            owner_party_type=contract_owner_party_type,
        )

        return prcontract.dumps(state=state, owner_party_type=contract_owner_party_type)
