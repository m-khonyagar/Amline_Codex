from sqlalchemy import desc, func

from account.domain.entities.user import User
from core.types import PaginateParams
from financial.domain.entities.discount import Discount
from unit_of_work import UnitOfWork


def get_promo_codes_handler(uow: UnitOfWork, paginate_params: PaginateParams, mobile: str | None):
    with uow:
        query = uow.session.query(Discount, User).join(User, Discount.created_by == User.id)
        if mobile:
            query = query.filter(Discount.specified_user_phone == mobile)
        count = query.count()
        query_result: list[tuple[Discount, User]] = (
            query.order_by(desc(func.coalesce(Discount.updated_at, Discount.created_at)))
            .limit(paginate_params.limit)
            .offset(paginate_params.offset)
            .all()
        )
        return {
            "total_count": count,
            "start_index": paginate_params.offset,
            "end_index": paginate_params.offset + len(query_result),
            "data": [discount.dumps(created_by_user=user.short_dumps()) for discount, user in query_result],
        }
