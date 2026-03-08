from sqlalchemy import desc

from account.domain.entities.user import User
from core.types import CurrentUser, PaginatedList, PaginateParams
from financial.domain.entities.settlement import Settlement
from financial.domain.enums import SettlementStatus
from unit_of_work import UnitOfWork


def get_all_wallet_settlements(
    uow: UnitOfWork,
    params: PaginateParams,
    current_user: CurrentUser,
    search_text: str | None = None,
    status: SettlementStatus | None = None,
):
    with uow:

        query = uow.session.query(Settlement).filter(
            Settlement.deleted_at.is_(None),  # type: ignore
        )

        if status:
            query = query.filter(Settlement.status == status)

        if search_text:
            query = query.join(User, User.id == Settlement.user_id).filter(User.mobile == search_text)

        total_count = query.count()

        settlements: list[Settlement] = (
            query.order_by(desc(Settlement.created_at)).limit(params.limit).offset(params.offset).all()  # type:ignore
        )
        result = [pwd.dumps() for pwd in settlements] if settlements else []

        return PaginatedList(
            total_count=total_count,
            data=result,
            start_index=params.offset,
            end_index=params.offset + len(result),
        )
