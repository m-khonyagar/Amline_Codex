from account.domain.entities.user import User
from contract.domain.entities.contract_clause import ContractClause
from contract.domain.enums import PartyType
from contract.domain.prcontract.clauses_generator import get_clause_name_and_number
from contract.service_layer.dtos import CreateContractClauseDto
from contract.service_layer.exceptions import PartyIsNotLandlordException
from unit_of_work import UnitOfWork


def create_contract_clause_handler(
    contract_id: int, data: CreateContractClauseDto, user: User, uow: UnitOfWork
) -> ContractClause:

    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        contract = uow.contracts.get_or_raise(id=contract_id)

        if not user.is_admin and contract.created_by != user.id:
            party = uow.contract_parties.get_party_or_raise(
                contract_id=contract_id, user_id=user.id, user_roles=user.roles
            )
            if party.party_type != PartyType.LANDLORD:
                raise PartyIsNotLandlordException

        name, number = get_clause_name_and_number(prcontract.is_guaranteed)
        clauses = uow.contract_clauses.get_by_contract_id_and_clause_number(prcontract.contract_id, number)

        next_subclause_number = len(clauses) + 1

        contract_clause = ContractClause(
            contract_id=contract_id,
            clause_name=name,
            clause_number=number,
            subclause_number=next_subclause_number,
            body=data.body,
        )

        uow.contract_clauses.add(contract_clause)
        uow.commit()
        uow.contract_clauses.refresh(contract_clause)
        return contract_clause
