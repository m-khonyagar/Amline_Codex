# flake8: noqa E501
from sqlalchemy import desc, func, not_, or_
from sqlalchemy.orm import aliased

from core.exceptions import NotFoundException
from core.types import PaginateParams
from crm.domain.entities.file_call import FileCall
from crm.domain.entities.file_label import FileLabel
from crm.domain.entities.landlord_file import LandlordFile
from crm.domain.enums import FileStatus
from crm.entrypoints.query_params import FileQueryParams
from unit_of_work import UnitOfWork


def get_all_landlord_files_handler(paginate_params: PaginateParams, query_params: FileQueryParams, uow: UnitOfWork):
    with uow:
        latest_call_subquery = (
            uow.session.query(FileCall.file_id, func.max(FileCall.created_at).label("max_created_at"))
            .group_by(FileCall.file_id)
            .subquery()
        )

        LatestCall = aliased(FileCall)

        files_query = (
            uow.session.query(LandlordFile, LatestCall)
            .outerjoin(latest_call_subquery, LandlordFile.id == latest_call_subquery.c.file_id)
            .outerjoin(
                LatestCall,
                (LatestCall.file_id == latest_call_subquery.c.file_id)
                & (LatestCall.created_at == latest_call_subquery.c.max_created_at),
            )
            .filter(
                LandlordFile.deleted_at.is_(None),  # type: ignore
                (
                    LandlordFile.file_status.in_([FileStatus.ARCHIVED, FileStatus.CANCELLED])  # type: ignore
                    if query_params.is_archived
                    else not_(LandlordFile.file_status.in_([FileStatus.ARCHIVED, FileStatus.CANCELLED]))  # type: ignore
                ),
                or_(LandlordFile.listing_type == query_params.listing_type, query_params.listing_type is None),  # type: ignore
                or_(LandlordFile.file_status == query_params.status, query_params.status is None),  # type: ignore
                or_(LandlordFile.mobile.ilike(f"%{query_params.mobile}%"), query_params.mobile is None),  # type: ignore
                or_(LandlordFile.assigned_to == query_params.assigned_to, query_params.assigned_to is None),  # type: ignore
                or_(LandlordFile.rent >= query_params.min_rent if query_params.min_rent else True),  # type: ignore
                or_(LandlordFile.rent <= query_params.max_rent if query_params.max_rent else True),  # type: ignore
                or_(LandlordFile.deposit >= query_params.min_deposit if query_params.min_deposit else True),  # type: ignore
                or_(LandlordFile.deposit <= query_params.max_deposit if query_params.max_deposit else True),  # type: ignore
                or_(LandlordFile.area >= query_params.min_area if query_params.min_area else True),  # type: ignore
                or_(LandlordFile.area <= query_params.max_area if query_params.max_area else True),  # type: ignore
                or_(LatestCall.status == query_params.call_status if query_params.call_status else True),  # type: ignore
                or_(LandlordFile.monopoly == query_params.monopoly if query_params.monopoly else True),  # type: ignore
                or_(LandlordFile.city_id.in_(query_params.city_ids) if query_params.city_ids else True),  # type: ignore
                or_(LandlordFile.district_id.in_(query_params.district_ids) if query_params.district_ids else True),  # type: ignore
                or_(LandlordFile.region.in_(query_params.regions) if query_params.regions else True),  # type: ignore
                or_(LandlordFile.label_ids.overlap(query_params.label_ids) if query_params.label_ids else True),  # type: ignore
                or_(LandlordFile.created_at >= query_params.start_date if query_params.start_date else True),  # type: ignore
                or_(LandlordFile.created_at <= query_params.end_date if query_params.end_date else True),  # type: ignore
                or_(LandlordFile.amline_ad_id == query_params.ad_id if query_params.ad_id else True),  # type: ignore
                or_(LandlordFile.description.ilike(f"%{query_params.description}%") if query_params.description else True),  # type: ignore
                or_(
                    LandlordFile.full_name.ilike(f"%{query_params.search}%"),  # type: ignore
                    LandlordFile.mobile.ilike(f"%{query_params.search}%"),  # type: ignore
                    query_params.search is None,  # type: ignore
                ),
            )
        )
        total_count = files_query.count()
        files: list[tuple[LandlordFile, FileCall | None]] = (
            files_query.order_by(desc(func.coalesce(LandlordFile.updated_at, LandlordFile.created_at)))
            .limit(paginate_params.limit)
            .offset(paginate_params.offset)
            .all()
        )

        all_label_ids = set()
        for file, _ in files:
            if file.label_ids:
                all_label_ids.update(file.label_ids)

        labels_dict = {}
        if all_label_ids:
            labels: list[FileLabel] = uow.session.query(FileLabel).filter(FileLabel.id.in_(all_label_ids)).all()  # type: ignore
            labels_dict = {label.id: label for label in labels}

        label_finder = lambda label_ids: (  # noqa: E731
            [labels_dict[label_id].dumps() for label_id in label_ids if label_id in labels_dict.keys()]
            if label_ids
            else []
        )

        return {
            "total_count": total_count,
            "start_index": paginate_params.offset,
            "end_index": paginate_params.offset + len(files),
            "data": [
                dict(**file.dumps(), call=call.dumps() if call else {}, labels=label_finder(file.label_ids))
                for file, call in files
            ],
        }


def get_landlord_file_handler(file_id: int, uow: UnitOfWork) -> dict:

    def image_object(image_id: int):
        image = uow.files.get(id=image_id)
        return image.dumps() if image else None

    with uow:
        file: LandlordFile | None = (
            uow.session.query(LandlordFile)
            .filter(
                LandlordFile.id == file_id,
                LandlordFile.deleted_at.is_(None),  # type: ignore
            )
            .first()
        )
        if not file:
            raise NotFoundException(detail="landlord_file_not_found")

        if file.label_ids:
            labels: list[FileLabel] = uow.session.query(FileLabel).filter(FileLabel.id.in_(file.label_ids)).all()  # type: ignore
            labels_dict = [label.dumps() for label in labels] if labels else None
        else:
            labels_dict = []

        images = (
            [image_object(image) for image in file.property_image_file_ids] if file.property_image_file_ids else None
        )
        cleaned_images = [image for image in images if image] if images else None

        return dict(
            **file.dumps(),
            images=cleaned_images,
            labels=labels_dict,
        )
