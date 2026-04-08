from account.domain.entities.user import User
from contract.service_layer.exceptions import UserIsNotContractPartyException
from unit_of_work import UnitOfWork


def get_contract_clause_detail_view(contract_id: int, clause_id: int, user: User, uow: UnitOfWork) -> dict:
    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        clause = uow.contract_clauses.get_or_raise(id=clause_id, contract_id=contract_id)
        if not user.is_admin and contract.created_by != user.id:
            contract_party = uow.contract_parties.get_by_contract_and_user(
                contract_id=contract.id, user_id=user.id, user_roles=user.roles
            )
            if not contract_party:
                raise UserIsNotContractPartyException
        return clause.dumps(contract=contract.dumps())
