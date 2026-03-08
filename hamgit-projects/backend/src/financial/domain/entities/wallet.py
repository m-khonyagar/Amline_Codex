from datetime import datetime

from core.base.base_entity import BaseEntity
from core.exceptions import ValidationException
from core.helpers import get_now
from core.translates import validation_trans
from financial.domain.enums import WalletStatus


class Wallet(BaseEntity):
    id: int
    credit: int
    user_id: int
    created_by: int
    updated_by: int | None
    bank_account_id: int | None
    status: WalletStatus
    created_at: datetime | None
    updated_at: datetime | None
    deleted_at: datetime | None

    def __init__(
        self,
        credit: int,
        user_id: int,
        created_by: int,
        updated_by: int | None = None,
        bank_account_id: int | None = None,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
        deleted_at: datetime | None = None,
    ):
        self.id = self.next_id
        self.credit = credit
        self.user_id = user_id
        self.created_by = created_by
        self.updated_by = updated_by
        self.status = WalletStatus.ACTIVE
        self.bank_account_id = bank_account_id
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at

    def add_credit(self, credit: int):
        if credit <= 0:
            raise ValidationException("Credit to add must be positive")
        self.credit += credit

    def withdraw_credit(self, credit: int):
        if credit <= 0:
            raise ValidationException("Credit to withdraw must be positive")
        if self.credit < credit:
            raise ValidationException(validation_trans.not_enough_credit)
        self.credit -= credit

    def soft_delete(self):
        self.deleted_at = get_now()

    def update_status(self, status: WalletStatus):
        self.status = status

    def update(self, bank_account_id: int, updated_by: int):
        self.bank_account_id = bank_account_id
        self.updated_by = updated_by
        self.updated_at = get_now()

    def dumps(self, **kwargs):
        return dict(
            id=str(self.id),
            credit=self.credit,
            user_id=str(self.user_id),
            created_by=str(self.created_by),
            updated_by=str(self.updated_by),
            bank_account_id=str(self.bank_account_id),
            status=WalletStatus.resolve(self.status),
            **kwargs,
        )
