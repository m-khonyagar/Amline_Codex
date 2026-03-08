from account.domain.entities.user import User
from contract.adapters.orm.read_only_models.contract_party_rom import ContractPartyROM
from core.exceptions import NotFoundException, PermissionException
from core.translates import not_found_trans, perm_trans
from unit_of_work import UnitOfWork


def get_prcontract_parties_view(contract_id: int, user: User, uow: UnitOfWork) -> list[dict]:
    with uow:
        parties: list[ContractPartyROM] = (
            uow.session.query(ContractPartyROM)
            .filter(
                ContractPartyROM.contract_id == contract_id,
                ContractPartyROM.deleted_at.is_(None),  # type: ignore
            )
            .all()
        )

        user_is_contract_party = False
        for party in parties:
            if party.user_id == user.id:
                user_is_contract_party = True
                break

        if not user_is_contract_party:
            raise PermissionException(perm_trans.user_is_not_contract_party)

        if not parties:
            raise NotFoundException(not_found_trans.contract_parties_not_found)

        return [party.dumps() for party in parties]
