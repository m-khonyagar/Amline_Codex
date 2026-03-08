# flake8: noqa E501
from sqlalchemy import desc, func, not_, or_
from sqlalchemy.orm import aliased

from core.types import PaginateParams
from crm.domain.entities.file_call import FileCall
from crm.domain.entities.file_label import FileLabel
from crm.domain.entities.tenant_file import TenantFile
from crm.domain.enums import FileStatus
from crm.entrypoints.query_params import FileQueryParams
from shared.domain.entities.district import District
from unit_of_work import UnitOfWork


def get_all_tenant_files_handler(paginate_params: PaginateParams, query_params: FileQueryParams, uow: UnitOfWork):
    with uow:
        latest_call_subquery = (
            uow.session.query(FileCall.file_id, func.max(FileCall.created_at).label("max_created_at"))
            .group_by(FileCall.file_id)
            .subquery()
        )
        LatestCall = aliased(FileCall)
        files_query = (
            uow.session.query(TenantFile, LatestCall)
            .outerjoin(latest_call_subquery, TenantFile.id == latest_call_subquery.c.file_id)
            .outerjoin(
                LatestCall,
                (LatestCall.file_id == latest_call_subquery.c.file_id)
                & (LatestCall.created_at == latest_call_subquery.c.max_created_at),
            )
            .filter(
                TenantFile.deleted_at.is_(None),  # type: ignore
                (
                    TenantFile.file_status.in_([FileStatus.ARCHIVED, FileStatus.CANCELLED])  # type: ignore
                    if query_params.is_archived
                    else not_(TenantFile.file_status.in_([FileStatus.ARCHIVED, FileStatus.CANCELLED]))  # type: ignore
                ),
                or_(TenantFile.listing_type == query_params.listing_type, query_params.listing_type is None),  # type: ignore
                or_(TenantFile.file_status == query_params.status, query_params.status is None),  # type: ignore
                or_(TenantFile.mobile.ilike(f"%{query_params.mobile}%"), query_params.mobile is None),  # type: ignore
                or_(TenantFile.assigned_to == query_params.assigned_to, query_params.assigned_to is None),  # type: ignore
                or_(TenantFile.rent >= query_params.min_rent if query_params.min_rent else True),  # type: ignore
                or_(TenantFile.rent <= query_params.max_rent if query_params.max_rent else True),  # type: ignore
                or_(TenantFile.deposit >= query_params.min_deposit if query_params.min_deposit else True),  # type: ignore
                or_(TenantFile.deposit <= query_params.max_deposit if query_params.max_deposit else True),  # type: ignore
                or_(LatestCall.status == query_params.call_status if query_params.call_status else True),  # type: ignore
                or_(TenantFile.city_id.in_(query_params.city_ids) if query_params.city_ids else True),  # type: ignore
                or_(TenantFile.district_ids.overlap(query_params.district_ids) if query_params.district_ids else True),  # type: ignore
                or_(TenantFile.regions.overlap(query_params.regions) if query_params.regions else True),  # type: ignore
                or_(TenantFile.label_ids.overlap(query_params.label_ids) if query_params.label_ids else True),  # type: ignore
                or_(TenantFile.created_at >= query_params.start_date if query_params.start_date else True),  # type: ignore
                or_(TenantFile.created_at <= query_params.end_date if query_params.end_date else True),  # type: ignore
                or_(TenantFile.family_members_count == query_params.family_members_count if query_params.family_members_count else True),  # type: ignore
                or_(TenantFile.amline_ad_id == query_params.ad_id if query_params.ad_id else True),  # type: ignore
                or_(TenantFile.description.ilike(f"%{query_params.description}%") if query_params.description else True),  # type: ignore
                or_(
                    TenantFile.full_name.ilike(f"%{query_params.search}%"),  # type: ignore
                    TenantFile.mobile.ilike(f"%{query_params.search}%"),  # type: ignore
                    query_params.search is None,  # type: ignore
                ),
            )
        )
        total_count = files_query.count()

        files: list[tuple[TenantFile, FileCall]] = (
            files_query.order_by(desc(func.coalesce(TenantFile.updated_at, TenantFile.created_at)))
            .limit(paginate_params.limit)
            .offset(paginate_params.offset)
            .all()
        )

        # Districts
        all_district_ids = set()
        for file, _ in files:
            if file.district_ids:
                all_district_ids.update(file.district_ids)

        districts_dict = {}
        if all_district_ids:
            districts: list[District] = uow.session.query(District).filter(District.id.in_(all_district_ids)).all()  # type: ignore
            districts_dict = {district.id: district for district in districts}

        district_finder = lambda district_ids: (  # noqa: E731
            [
                districts_dict[district_id].dumps()
                for district_id in district_ids
                if district_id in districts_dict.keys()
            ]
            if district_ids
            else []
        )

        # Labels
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
                dict(
                    **file.dumps(),
                    districts=district_finder(file.district_ids),
                    labels=label_finder(file.label_ids),
                    call=latest_call.dumps() if latest_call else None,
                )
                for file, latest_call in files
            ],
        }


def get_tenant_file_handler(file_id: int, uow: UnitOfWork) -> dict:
    with uow:
        file: TenantFile = uow.tenant_files.get_or_raise(id=file_id)
        districts_list = []
        if file.district_ids:
            districts: list[District] = uow.session.query(District).filter(District.id.in_(file.district_ids)).all()  # type: ignore
            districts_list = [district.dumps() for district in districts]

        labels_list = []
        if file.label_ids:
            labels: list[FileLabel] = uow.session.query(FileLabel).filter(FileLabel.id.in_(file.label_ids)).all()  # type: ignore
            labels_list = [label.dumps() for label in labels]

        return dict(
            **file.dumps(),
            districts=districts_list,
            labels=labels_list,
        )
