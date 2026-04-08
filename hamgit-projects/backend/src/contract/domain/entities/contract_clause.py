import datetime as dt

from core.base.base_entity import BaseEntity
from core.exceptions import ProcessingException
from core.translates import processing_trans


class ContractClause(BaseEntity):
    id: int
    contract_id: int
    clause_name: str  # نام ماده
    clause_number: int  # شماره ماده
    subclause_number: int  # شماره بند
    body: str  # متن
    subclause_name: str | None  # عنوان بند
    is_editable: bool
    is_deletable: bool
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None

    def __init__(
        self,
        contract_id: int,
        subclause_number: int,
        body: str,
        clause_name: str,
        is_editable: bool = True,
        is_deletable: bool = True,
        clause_number: int = 6,
        subclause_name: str | None = None,
    ) -> None:
        self.id = self.next_id
        self.contract_id = contract_id
        self.clause_name = clause_name
        self.clause_number = clause_number
        self.subclause_name = subclause_name
        self.subclause_number = subclause_number
        self.body = body
        self.is_editable = is_editable
        self.is_deletable = is_deletable

    def update(self, body: str) -> None:
        if not self.is_editable:
            raise ProcessingException(processing_trans.contract_clause_is_read_only)
        self.body = body

    def force_update(self, body: str) -> None:
        self.body = body

    def delete(self) -> None:
        if not self.is_editable or not self.is_deletable:
            raise ProcessingException(processing_trans.contract_clause_is_not_deletable)
        self.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

    def force_delete(self) -> None:
        self.deleted_at = dt.datetime.now(tz=dt.timezone.utc)

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            contract=kwargs.get("contract", {"id": str(self.contract_id)}),
            clause_name=self.clause_name,
            clause_number=self.clause_number,
            subclause_number=self.subclause_number,
            subclause_name=self.subclause_name,
            body=self.body,
            is_editable=self.is_editable,
            is_deletable=self.is_deletable,
        )
