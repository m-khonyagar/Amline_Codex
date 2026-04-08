from contract.service_layer.exceptions import PartyIsNotContractOwnerException
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_prcontract_counter_party_view(contract_id: int, user: CurrentUser, uow: UnitOfWork) -> dict:
    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)

        if prcontract.owner.user_id != user.id:
            raise PartyIsNotContractOwnerException

        counter_party = uow.contract_parties.get(contract_id=contract_id, party_type=prcontract.counter_party_type)

        if counter_party:
            party_user = uow.users.get_or_raise(id=counter_party.user_id)
            return dict(
                party_type=counter_party.party_type,
                mobile=party_user.mobile,
                national_code=party_user.national_code,
            )

        return dict()
