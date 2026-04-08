from advertisement.domain.enums import VisitRequestStatus
from core.types import PaginatedList, PaginateParams
from unit_of_work import UnitOfWork


def get_visit_requests_list(filter: VisitRequestStatus | None, params: PaginateParams, uow: UnitOfWork):

    total_count = 0
    with uow:
        if visit_requests := uow.visit_requests.find_by_status(filter):
            total_count = len(visit_requests)

        return PaginatedList(
            total_count=total_count,
            data=[visit_request.dumps() for visit_request in visit_requests] if visit_requests else [],
            start_index=params.offset,
            end_index=params.offset + total_count,
        )
