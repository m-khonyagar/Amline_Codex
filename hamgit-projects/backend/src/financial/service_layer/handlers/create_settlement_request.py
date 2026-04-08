from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from financial.domain.entities.settlement import Settlement
from financial.domain.enums import WalletTransactionCategory
from financial.service_layer.dtos import CreateSettlementDto
from financial.service_layer.services.wallet_service import WalletService
from unit_of_work import UnitOfWork


def create_settlement_request_handler(
    uow: UnitOfWork,
    current_user: CurrentUser,
    command: CreateSettlementDto,
) -> dict:
    with uow:
        # TODO get with lock for all wallet transactions
        user_wallet = uow.wallets.get_or_raise(user_id=current_user.id)

        if user_wallet.credit < command.amount:
            raise PermissionException(perm_trans.insufficient_credit)

        settlement = Settlement.create(
            amount=command.amount, user_id=current_user.id, shaba=command.shaba, shaba_owner=command.shaba_owner
        )
        WalletService(uow, current_user.id).withdraw_credits(command.amount, WalletTransactionCategory.WALLET_WITHDRAW)
        uow.settlements.add(settlement)
        uow.commit()

        return settlement.dumps()
