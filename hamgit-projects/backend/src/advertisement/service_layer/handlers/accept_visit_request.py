from advertisement.domain.enums import VisitRequestStatus
from advertisement.service_layer.dtos import AcceptVisitRequestDto
from core.helpers import get_now
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def accept_visit_request_handler(data: AcceptVisitRequestDto, uow: UnitOfWork, current_user: CurrentUser):

    with uow:
        visit_request = uow.visit_requests.get_or_raise(id=data.advertisement_id)
        visit_request.accepted_at = get_now()
        visit_request.status = VisitRequestStatus.ACCEPTED
        visit_request.accepted_by = current_user.id
        visit_request.description = data.description
        uow.commit()
