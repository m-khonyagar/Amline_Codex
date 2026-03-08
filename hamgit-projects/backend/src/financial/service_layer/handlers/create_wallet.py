from core.exceptions import PermissionException
from core.types import CurrentUser
from financial.domain.entities.wallet import Wallet
from unit_of_work import UnitOfWork


def create_wallet_handler(uow: UnitOfWork, current_user: CurrentUser, mobile: str) -> dict:

    with uow:
        user = uow.users.get_or_raise(mobile=mobile)

        if uow.wallets.get(user_id=user.id):
            raise PermissionException("User already has a wallet")

        wallet = Wallet(
            credit=0,
            user_id=user.id,
            created_by=current_user.id,
            updated_by=current_user.id,
        )
        uow.wallets.add(wallet)
        uow.commit()

        return wallet.dumps()
