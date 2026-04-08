from contract.domain.entities.contract_clause import ContractClause
from contract.domain.enums import PartyType
from contract.service_layer.exceptions import PartyIsNotLandlordException
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def update_contract_clause_handler(
    contract_id: int, clause_id: int, clause_body: str, user: CurrentUser, uow: UnitOfWork
) -> ContractClause:
    with uow:
        clause = uow.contract_clauses.get_or_raise(id=clause_id, contract_id=contract_id)
        contract = uow.contracts.get_or_raise(id=contract_id)
        if not user.is_admin and contract.created_by != user.id:
            party = uow.contract_parties.get_party_or_raise(
                contract_id=contract_id, user_id=user.id, user_roles=user.roles
            )
            if party.party_type != PartyType.LANDLORD:
                raise PartyIsNotLandlordException

        if user.is_admin:
            clause.force_update(body=clause_body)
        else:
            clause.update(body=clause_body)

        uow.commit()
        uow.contract_clauses.refresh(clause)

    return clause
