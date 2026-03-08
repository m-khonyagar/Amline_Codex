from unit_of_work import UnitOfWork


def get_user_bank_accounts_view(user_id: int, uow: UnitOfWork) -> list[dict]:
    with uow:
        bank_accounts = uow.bank_accounts.get_by_user_id(user_id=user_id)
        return [ba.dumps() for ba in bank_accounts]
