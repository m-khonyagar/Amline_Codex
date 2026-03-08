from contract.entrypoints.request_models import UpdateBaseContractClauseRequest
from unit_of_work import UnitOfWork


def update_base_contract_clauses_handler(id: int, data: UpdateBaseContractClauseRequest, uow: UnitOfWork):
    with uow:
        base_contract_clauses = uow.base_contract_clauses.get_or_raise(id=id)
        base_contract_clauses.update(
            contract_type=data.contract_type,
            clauses_type=data.clauses_type,
            clauses=data.clauses,
        )
        uow.commit()
        return base_contract_clauses.dumps()
