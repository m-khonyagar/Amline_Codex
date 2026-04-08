from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_user_wallet(uow: UnitOfWork, current_user: CurrentUser):
    with uow:
        wallet = uow.wallets.get_or_raise(user_id=current_user.id)
        return wallet.dumps()
