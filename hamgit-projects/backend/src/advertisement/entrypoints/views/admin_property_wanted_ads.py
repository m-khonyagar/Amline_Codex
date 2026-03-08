from sqlalchemy import desc, or_
from sqlalchemy.sql import func

from account.domain.entities.user import User
from advertisement.domain.entities.property_wanted_ad import PropertyWantedAd
from advertisement.domain.enums import AdStatus
from core.types import PaginatedList, PaginateParams
from unit_of_work import UnitOfWork


def get_admin_property_wanted_ads(
    params: PaginateParams,
    search_text: str | None,
    status: AdStatus | None,
    is_reported: bool,
    is_archived: bool,
    uow: UnitOfWork,
):

    with uow:
        query = uow.session.query(PropertyWantedAd).filter(
            PropertyWantedAd.deleted_at.is_(None),  # type: ignore
            (
                PropertyWantedAd.status == AdStatus.ARCHIVED
                if is_archived
                else or_(
                    PropertyWantedAd.status != AdStatus.ARCHIVED,  # type: ignore
                    PropertyWantedAd.status.is_(None),  # type: ignore
                )
            ),
        )

        if is_reported:
            query = query.filter(PropertyWantedAd.is_reported == is_reported)

        if status:
            query = query.filter(PropertyWantedAd.status == status)

        if search_text:
            query = query.join(User, User.id == PropertyWantedAd.user_id).filter(User.mobile == search_text)

        total_count = query.count()

        property_wanted_ads: list[PropertyWantedAd] = (
            query.order_by(desc(func.coalesce(PropertyWantedAd.updated_at, PropertyWantedAd.created_at)))
            .limit(params.limit)
            .offset(params.offset)
            .all()
        )
        users_dict = {u.id: u for u in uow.users.get_by_ids([p.user_id for p in property_wanted_ads])}
        for p in property_wanted_ads:
            if user := users_dict.get(p.user_id):
                p.user = user.dumps()

        result = [pwd.dumps() for pwd in property_wanted_ads] if property_wanted_ads else []
        return PaginatedList(
            total_count=total_count,
            data=result,
            start_index=params.offset,
            end_index=params.offset + total_count,
        )
