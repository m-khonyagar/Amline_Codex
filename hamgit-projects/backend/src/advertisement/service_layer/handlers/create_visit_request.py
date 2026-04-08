from advertisement.domain.entities.visit_request import VisitRequest
from advertisement.service_layer.dtos import CreateVisitRequestDto
from core.exceptions import PermissionException
from core.translates import perm_trans
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def create_visit_request_handler(command: CreateVisitRequestDto, uow: UnitOfWork, current_user: CurrentUser) -> bool:
    with uow:
        property_ad = uow.property_ads.get_or_raise(id=command.advertisement_id)
        owner_user = uow.users.get_or_raise(id=property_ad.user_id)
        if visit_request := uow.visit_requests.find_by_requester_and_ad(current_user.id, command.advertisement_id):
            raise PermissionException(detail=perm_trans.request_already_submitted)

        visit_request = VisitRequest.create(
            advertisement_id=command.advertisement_id,
            requester_user_id=current_user.id,
            requester_mobile=current_user.mobile,
            owner_user_id=owner_user.id,
            owner_mobile=owner_user.mobile,
        )

        uow.visit_requests.add(visit_request)
        uow.commit()

        return True
