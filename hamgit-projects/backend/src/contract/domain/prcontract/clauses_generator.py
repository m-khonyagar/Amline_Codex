# flake8: noqa E501

from contract.domain.entities.base_contract_clauses import BaseContractClauses
from contract.domain.entities.contract_clause import ContractClause
from unit_of_work import UnitOfWork


def get_clause_name_and_number(is_guaranteed: bool) -> tuple[str, int]:
    """
    Returns the name and number of the clause.

    In guaranteed contracts, create a clause named "سایر تعهدات" with number 11.
    In default contracts, new clauses are added to the "تعهدات طرفین" with number 6.
    """
    if is_guaranteed:
        return ("سایر تعهدات", 11)
    return ("تعهدات طرفین", 6)


def generate_clauses(uow: UnitOfWork, contract_id: int, is_guaranteed: bool = False) -> list[ContractClause]:
    clause_type = "GUARANTEED_CLAUSES" if is_guaranteed else "DEFAULT_CLAUSES"
    base_contract_clauses: BaseContractClauses = (
        uow.session.query(BaseContractClauses).filter(BaseContractClauses.clauses_type == clause_type).first()
    )
    clauses = base_contract_clauses.clauses
    prc_clauses = []
    for clause in clauses:
        clause_name = clause["clause_name"]
        clause_number = clause["clause_number"]
        subclauses: list[dict] = clause["subclauses"]

        for subclause in subclauses:
            prc_clauses.append(
                ContractClause(
                    contract_id=contract_id,
                    clause_name=clause_name,
                    clause_number=clause_number,
                    subclause_name=subclause["subclause_name"],
                    subclause_number=subclause["subclause_number"],
                    body=subclause["body"],
                    is_editable=subclause["is_editable"],
                    is_deletable=subclause["is_deletable"],
                )
            )

    return prc_clauses
