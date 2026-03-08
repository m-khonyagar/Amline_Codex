import datetime as dt

from contract.domain.enums import ClausesType, ContractType
from core.base.base_entity import BaseEntity


class BaseContractClauses(BaseEntity):
    id: int
    contract_type: ContractType
    clauses_type: ClausesType
    clauses: list[dict]
    clauses_backup: list[dict] | None

    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(self, contract_type: ContractType, clauses_type: ClausesType, clauses: list[dict]):
        self.contract_type = contract_type
        self.clauses_type = clauses_type
        self.clauses = clauses
        self.clauses_backup = clauses

    def update(self, contract_type: ContractType, clauses_type: ClausesType, clauses: list[dict]):
        self.clauses_backup = self.clauses
        self.contract_type = contract_type
        self.clauses_type = clauses_type
        self.clauses = clauses
        self.updated_at = dt.datetime.now()

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=self.id,
            contract_type=self.contract_type,
            clauses_type=self.clauses_type,
            clauses=self.clauses,
            **kwargs,
        )
