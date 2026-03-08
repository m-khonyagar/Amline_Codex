from fastapi import APIRouter, Depends

import di
from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from core.middlewares.access_checker import has_access
from crm.entrypoints.request_models import FileCallCreateRequest
from crm.service_layer.handlers import create_file_call_handler
from crm.service_layer.handlers.get_file_call_by_file_id import (
    get_file_calls_by_file_id,
)
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/file-calls", tags=["file calls"])


@router.post("")
@has_access(RoleAccess.AD_MODERATOR)
def create_file_call(
    data: FileCallCreateRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return create_file_call_handler(data=data, uow=uow, current_user=current_user)


@router.get("/{file_id}/calls")
@has_access(RoleAccess.AD_MODERATOR)
def get_file_calls(file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_file_calls_by_file_id(file_id=file_id, uow=uow)
