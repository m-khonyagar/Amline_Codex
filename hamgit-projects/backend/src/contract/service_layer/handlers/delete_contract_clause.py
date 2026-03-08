from contract.domain.enums import PartyType
from contract.service_layer.exceptions import PartyIsNotLandlordException
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def delete_contract_clause_handler(contract_id: int, clause_id: int, user: CurrentUser, uow: UnitOfWork) -> None:
    with uow:
        clause = uow.contract_clauses.get_or_raise(id=clause_id, contract_id=contract_id)
        contract = uow.contracts.get_or_raise(id=contract_id)
        if not user.is_admin and contract.created_by != user.id:
            party = uow.contract_parties.get_party_or_raise(
                contract_id=contract_id, user_id=user.id, user_roles=user.roles
            )
            if party.party_type != PartyType.LANDLORD:
                raise PartyIsNotLandlordException

        subclause_number = clause.subclause_number

        if user.is_admin:
            clause.force_delete()
        else:
            clause.delete()
        uow.commit()
        uow.contract_clauses.refresh(clause)

        # Fetch all clauses with the same contract_id and clause_number that have a higher subclause_number
        remaining_clauses = uow.contract_clauses.get_by_contract_id_and_clause_number(
            contract_id=contract_id, clause_number=clause.clause_number, min_subclause_number=subclause_number + 1
        )

        # Reorder the subclause numbers
        for index, remaining_clause in enumerate(remaining_clauses, start=subclause_number):
            remaining_clause.subclause_number = index

        uow.commit()
