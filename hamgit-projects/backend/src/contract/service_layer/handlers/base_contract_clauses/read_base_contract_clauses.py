from unit_of_work import UnitOfWork


def read_base_contract_clauses_handler(uow: UnitOfWork):
    with uow:
        base_contract_clauses = uow.base_contract_clauses.get_all_simple()
        return [base_contract_clause.dumps() for base_contract_clause in base_contract_clauses]
