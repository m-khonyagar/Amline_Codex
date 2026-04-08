from core.exceptions import PermissionException
from core.helpers import get_now
from core.translates import perm_trans
from core.types import CurrentUser
from financial.domain.enums import SettlementStatus, WalletTransactionCategory
from financial.service_layer.dtos import UpdateSettlementDto
from financial.service_layer.services.wallet_service import WalletService
from unit_of_work import UnitOfWork


def admin_update_settlement_handler(
    command: UpdateSettlementDto,
    uow: UnitOfWork,
    current_user: CurrentUser,
) -> bool:
    with uow:
        settlement = uow.settlements.get_or_raise(id=command.settlement_id)

        if settlement.status == SettlementStatus.REJECTED:
            raise PermissionException(perm_trans.settlement_already_rejected)

        if command.status == SettlementStatus.REJECTED:
            WalletService(uow, settlement.user_id).add_credits(
                settlement.amount, WalletTransactionCategory.WALLET_CHARGE
            )
        elif command.status == SettlementStatus.SUCCESS:
            settlement.settled_by = current_user.id
            settlement.settled_at = get_now()

        settlement.status = command.status
        settlement.description = command.description

        uow.commit()

        return True
