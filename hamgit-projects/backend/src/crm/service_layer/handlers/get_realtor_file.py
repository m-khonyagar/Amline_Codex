# flake8: noqa E501
from sqlalchemy import desc, func, or_

from core.exceptions import NotFoundException
from core.types import PaginateParams
from crm.domain.entities.realtor_file import RealtorFile
from crm.entrypoints.query_params import FileQueryParams
from shared.domain.entities.district import District
from unit_of_work import UnitOfWork


def get_all_realtor_files_handler(paginate_params: PaginateParams, query_params: FileQueryParams, uow: UnitOfWork):
    with uow:
        files_query = uow.session.query(RealtorFile).filter(
            RealtorFile.deleted_at.is_(None),  # type: ignore
            or_(RealtorFile.file_status == query_params.status, query_params.status is None),  # type: ignore
            or_(RealtorFile.mobile.ilike(f"%{query_params.mobile}%"), query_params.mobile is None),  # type: ignore
            or_(RealtorFile.full_name.ilike(f"%{query_params.search}%"), query_params.search is None),  # type: ignore
            or_(RealtorFile.assigned_to == query_params.assigned_to, query_params.assigned_to is None),  # type: ignore
            or_(RealtorFile.city_id.in_(query_params.city_ids) if query_params.city_ids else True),  # type: ignore
            or_(RealtorFile.district_ids.overlap(query_params.district_ids) if query_params.district_ids else True),  # type: ignore
            or_(RealtorFile.regions.overlap(query_params.regions) if query_params.regions else True),  # type: ignore
            or_(RealtorFile.created_at >= query_params.start_date if query_params.start_date else True),  # type: ignore
            or_(RealtorFile.created_at <= query_params.end_date if query_params.end_date else True),  # type: ignore
        )
        total_count = files_query.count()
        files: list[RealtorFile] = (
            files_query.order_by(desc(func.coalesce(RealtorFile.updated_at, RealtorFile.created_at)))
            .limit(paginate_params.limit)
            .offset(paginate_params.offset)
            .all()
        )

        all_district_ids = set()
        for file in files:
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

        return {
            "total_count": total_count,
            "start_index": paginate_params.offset,
            "end_index": paginate_params.offset + len(files),
            "data": [
                dict(
                    **file.dumps(),
                    districts=district_finder(file.district_ids),
                )
                for file in files
            ],
        }


def get_realtor_file_handler(file_id: int, uow: UnitOfWork) -> dict:
    with uow:
        file: RealtorFile | None = (
            uow.session.query(RealtorFile)
            .filter(
                RealtorFile.id == file_id,
                RealtorFile.deleted_at.is_(None),  # type: ignore
            )
            .first()
        )
        if not file:
            raise NotFoundException(detail="realtor_file_not_found")

        districts_dict = []
        if file.district_ids:
            districts: list[District] = uow.session.query(District).filter(District.id.in_(file.district_ids)).all()  # type: ignore
            districts_dict = [district.dumps() for district in districts]

        return dict(
            **file.dumps(),
            districts=districts_dict
        ) | {
            "full_name": file.created_by_user.fullname
        }
