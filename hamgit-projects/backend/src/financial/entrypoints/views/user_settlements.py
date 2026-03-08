from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_user_wallet_settlements(uow: UnitOfWork, current_user: CurrentUser) -> list[dict]:
    with uow:
        settlements = uow.settlements.get_all_simple(user_id=current_user.id)
        return [s.dumps() for s in sorted(settlements, key=lambda x: x.created_at)]
