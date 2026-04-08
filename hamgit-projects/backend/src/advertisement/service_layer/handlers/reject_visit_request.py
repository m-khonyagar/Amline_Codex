from datetime import UTC, datetime

from advertisement.domain.enums import VisitRequestStatus
from advertisement.service_layer.dtos import RejectVisitRequestDto
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def reject_visit_request_handler(data: RejectVisitRequestDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        visit_request = uow.visit_requests.get_or_raise(id=data.advertisement_id)
        visit_request.status = VisitRequestStatus.REJECTED
        visit_request.rejected_at = datetime.now(UTC)
        visit_request.description = data.description
        uow.commit()
