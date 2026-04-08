import datetime as dt

from account.domain.enums import UserRole
from core.base.base_entity import BaseEntity


class BankAccount(BaseEntity):
    id: int
    user_id: int
    user_role: UserRole
    iban: str  # شماره شبا
    owner_name: str  # نام صاحب حساب
    bank_name: str | None  # نام بانک
    branch_name: str | None  # نام شعبه
    card_number: str | None  # شماره کارت
    account_number: str | None  # شماره حساب
    created_at: dt.datetime
    updated_at: dt.datetime | None
    deleted_at: dt.datetime | None
    # TODO is_primary: bool

    def __init__(
        self,
        user_id: int,
        iban: str,
        owner_name: str,
        user_role: UserRole = UserRole.PERSON,
        bank_name: str | None = None,
        branch_name: str | None = None,
        card_number: str | None = None,
        account_number: str | None = None,
    ) -> None:
        self.id = self.next_id
        self.user_id = user_id
        self.user_role = user_role
        self.iban = iban
        self.owner_name = owner_name
        self.bank_name = bank_name
        self.branch_name = branch_name
        self.card_number = card_number
        self.account_number = account_number

    def update(
        self,
        iban: str | None = None,
        owner_name: str | None = None,
        bank_name: str | None = None,
        branch_name: str | None = None,
        card_number: str | None = None,
        account_number: str | None = None,
    ) -> None:
        self.iban = iban or self.iban
        self.owner_name = owner_name or self.owner_name
        self.bank_name = bank_name or self.bank_name
        self.branch_name = branch_name or self.branch_name
        self.card_number = card_number or self.card_number
        self.account_number = account_number or self.account_number

    def dumps(self, **kwargs) -> dict:
        return dict(
            id=str(self.id),
            user_id=str(self.user_id),
            user_role=self.user_role,
            iban=self.iban,
            owner_name=self.owner_name,
            bank_name=self.bank_name,
            branch_name=self.branch_name,
            card_number=self.card_number,
            account_number=self.account_number,
            **kwargs,
        )
