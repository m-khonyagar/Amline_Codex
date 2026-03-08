from sqlalchemy import desc, or_
from sqlalchemy.sql import func

from account.domain.entities.user import User
from advertisement.domain.entities.property_ad import PropertyAd
from advertisement.domain.enums import AdStatus
from core.types import PaginatedList, PaginateParams
from unit_of_work import UnitOfWork


def get_admin_property_ads(
    params: PaginateParams,
    status: AdStatus | None,
    search_text: str | None,
    is_reported: bool,
    is_archived: bool,
    uow: UnitOfWork,
):

    with uow:

        query = uow.session.query(PropertyAd).filter(
            PropertyAd.deleted_at.is_(None),  # type: ignore
            (
                PropertyAd.status == AdStatus.ARCHIVED
                if is_archived
                else or_(
                    PropertyAd.status != AdStatus.ARCHIVED,  # type: ignore
                    PropertyAd.status.is_(None),  # type: ignore
                )
            ),
        )

        if is_reported:
            query = query.filter(PropertyAd.is_reported == is_reported)

        if status:
            query = query.filter(PropertyAd.status == status)

        if search_text:
            query = query.join(User, User.id == PropertyAd.user_id).filter(User.mobile == search_text)

        total_count = query.count()

        property_ads: list[PropertyAd] = (
            query.order_by(desc(func.coalesce(PropertyAd.updated_at, PropertyAd.created_at)))
            .limit(params.limit)
            .offset(params.offset)
            .all()
        )

        for ad in property_ads:
            if ad.image_file_ids:
                if file := uow.files.get(id=ad.image_file_ids[0]):
                    ad.images = [file.dumps()] if file.url else []
            else:
                ad.images = []

        result = [pad.dumps(images=pad.images) for pad in property_ads]
        return PaginatedList(
            total_count=total_count,
            data=result,
            start_index=params.offset,
            end_index=params.offset + len(result),
        )
