from account.domain.entities.bank_account import BankAccount
from account.service_layer.dtos import CreateBankAccountDto
from core.exceptions import ConflictException
from core.translates.conflict_exception import ConflictExcTrans
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_bank_account_handler(data: CreateBankAccountDto, current_user: CurrentUser, uow: UnitOfWork) -> BankAccount:
    with uow:

        bank_account = uow.bank_accounts.get(iban=data.iban, user_role=data.user_role)

        if bank_account:
            raise ConflictException(ConflictExcTrans.bank_account_already_exists)

        bank_account = BankAccount(
            user_id=current_user.id,
            user_role=data.user_role,
            iban=data.iban,
            owner_name=data.owner_name,
            bank_name=data.bank_name,
            branch_name=data.branch_name,
            card_number=data.card_number,
            account_number=data.account_number,
        )

        uow.bank_accounts.add(bank_account)
        uow.commit()
        uow.bank_accounts.refresh(bank_account)
        return bank_account
