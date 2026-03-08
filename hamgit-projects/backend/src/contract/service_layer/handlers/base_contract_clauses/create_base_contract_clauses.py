from contract.domain.entities.base_contract_clauses import BaseContractClauses
from contract.entrypoints.request_models import CreateBaseContractClauseRequest
from unit_of_work import UnitOfWork


def create_base_contract_clauses_handler(data: CreateBaseContractClauseRequest, uow: UnitOfWork):
    with uow:
        base_contract_clauses = BaseContractClauses(
            contract_type=data.contract_type,
            clauses_type=data.clauses_type,
            clauses=data.clauses,
        )
        uow.base_contract_clauses.add(base_contract_clauses)
        uow.commit()
        return base_contract_clauses.dumps()
