# flake8: noqa E501
from sqlalchemy import desc, or_

from core.types import PaginateParams
from crm.domain.entities.file_connection import FileConnection
from crm.domain.enums import FileStatus
from crm.entrypoints.query_params import FileConnectionQueryParams
from unit_of_work import UnitOfWork


def get_all_file_connections_handler(
    paginate_params: PaginateParams, query_params: FileConnectionQueryParams, uow: UnitOfWork
) -> dict:
    with uow:
        connections_query = uow.session.query(FileConnection).filter(
            FileConnection.deleted_at.is_(None),  # type: ignore
            or_(FileConnection.initiator == query_params.initiator, query_params.initiator is None),  # type: ignore
            or_(FileConnection.status == query_params.status, query_params.status is None),  # type: ignore
            or_(FileConnection.landlord_file_id == query_params.landlord_file_id, query_params.landlord_file_id is None),  # type: ignore
            or_(FileConnection.tenant_file_id == query_params.tenant_file_id, query_params.tenant_file_id is None),  # type: ignore
        )

        total_count = connections_query.count()
        connections: list[FileConnection] = (
            connections_query.order_by(desc(FileConnection.created_at))  # type: ignore
            .limit(paginate_params.limit)
            .offset(paginate_params.offset)
            .all()
        )

        return {
            "total_count": total_count,
            "start_index": paginate_params.offset,
            "end_index": paginate_params.offset + len(connections),
            "data": [
                connection.dumps()
                for connection in connections
                if connection.landlord_file.file_status not in [FileStatus.CANCELLED, FileStatus.ARCHIVED]
                and connection.tenant_file.file_status not in [FileStatus.CANCELLED, FileStatus.ARCHIVED]
            ],
        }
