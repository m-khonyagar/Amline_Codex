from fastapi import APIRouter, Depends

import di
from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from core.middlewares.access_checker import has_access
from core.types import PaginateParams
from crm.entrypoints.query_params import FileQueryParams
from crm.entrypoints.request_models import PublishFileRequest, UpsertLandlordFileRequest
from crm.service_layer import handlers
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/landlord-files", tags=["landlord files"])


@router.post("")
@has_access(RoleAccess.AD_MODERATOR)
def create_landlord_file(
    data: UpsertLandlordFileRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return handlers.create_landlord_file_handler(data=data, uow=uow, current_user=current_user)


@router.put("/{file_id}")
@has_access(RoleAccess.AD_MODERATOR)
def update_landlord_file(
    file_id: int,
    data: UpsertLandlordFileRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return handlers.update_landlord_file_handler(file_id=file_id, data=data, uow=uow, current_user=current_user)


@router.get("")
@has_access(RoleAccess.AD_MODERATOR)
def get_all_landlord_files(
    paginate_params: PaginateParams = Depends(),
    query_params: FileQueryParams = Depends(),
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return handlers.get_all_landlord_files_handler(paginate_params=paginate_params, query_params=query_params, uow=uow)


@router.get("/{file_id}")
@has_access(RoleAccess.AD_MODERATOR)
def get_landlord_file(file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return handlers.get_landlord_file_handler(file_id=file_id, uow=uow)


@router.post("/{file_id}/publish")
@has_access(RoleAccess.AD_MODERATOR)
def publish_landlord_file(
    file_id: int,
    data: PublishFileRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: User = Depends(di.get_current_user),
    _: User = Depends(di.get_current_user),
):
    return handlers.publish_landlord_file_handler(file_id=file_id, title=data.title, uow=uow, current_user=current_user)


@router.get("/{file_id}/match")
@has_access(RoleAccess.AD_MODERATOR)
def match_landlord_file(file_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return handlers.match_landlord_file_handler(file_id=file_id, uow=uow)
