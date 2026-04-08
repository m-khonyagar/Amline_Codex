from sqlalchemy import desc
from sqlalchemy.sql import func

from account.domain.entities.user import User
from advertisement.domain.entities.swap_ad import SwapAd
from advertisement.domain.enums import AdStatus
from core.types import PaginatedList, PaginateParams
from unit_of_work import UnitOfWork


def get_admin_swap_ads(
    params: PaginateParams, search_text: str | None, status: AdStatus | None, is_reported: bool, uow: UnitOfWork
):

    with uow:
        query = uow.session.query(SwapAd).filter(
            SwapAd.deleted_at.is_(None),  # type: ignore
        )

        if is_reported:
            query = query.filter(SwapAd.is_reported == is_reported)

        if status:
            query = query.filter(SwapAd.status == status)

        if search_text:
            query = query.join(User, User.id == SwapAd.user_id).filter(User.mobile == search_text)

        total_count = query.count()

        swap_ads: list[SwapAd] = (
            query.order_by(desc(func.coalesce(SwapAd.updated_at, SwapAd.created_at)))
            .limit(params.limit)
            .offset(params.offset)
            .all()
        )
        result = [pwd.dumps() for pwd in swap_ads] if swap_ads else []

        return PaginatedList(
            total_count=total_count,
            data=result,
            start_index=params.offset,
            end_index=params.offset + len(result),
        )
