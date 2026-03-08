from fastapi import APIRouter, Depends

import di
from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from core.middlewares.access_checker import has_access
from crm.entrypoints.request_models import FileTextCreateRequest
from crm.service_layer.handlers import create_file_text_handler
from crm.service_layer.handlers.get_file_text_by_file_id import (
    get_file_texts_by_file_id,
)
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/file-texts", tags=["file texts"])


@router.post("")
@has_access(RoleAccess.AD_MODERATOR)
def create_file_text(
    data: FileTextCreateRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
    sms_service: SMSService = Depends(di.get_sms_service),
):
    return create_file_text_handler(data=data, uow=uow, current_user=current_user, sms_service=sms_service)


@router.get("/{file_id}/texts")
@has_access(RoleAccess.AD_MODERATOR)
def get_file_texts(file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_file_texts_by_file_id(file_id=file_id, uow=uow)
