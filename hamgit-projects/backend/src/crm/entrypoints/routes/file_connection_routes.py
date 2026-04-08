from fastapi import APIRouter, Depends

import di
from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from core.middlewares.access_checker import has_access
from core.types import PaginateParams
from crm.entrypoints.query_params import FileConnectionQueryParams
from crm.entrypoints.request_models import (
    CreateFileConnectionBulkRequest,
    UpdateFileConnectionRequest,
)
from crm.service_layer.handlers import (
    delete_file_connection_handler,
    get_all_file_connections_handler,
    update_file_connection_handler,
)
from crm.service_layer.handlers.create_file_connection import (
    create_file_connection_bulk_handler,
)
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/file-connections", tags=["file connections"])


@router.get("")
@has_access(RoleAccess.AD_MODERATOR)
def get_file_connections(
    paginate_params: PaginateParams = Depends(),
    query_params: FileConnectionQueryParams = Depends(),
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return get_all_file_connections_handler(paginate_params=paginate_params, query_params=query_params, uow=uow)


@router.post("")
@has_access(RoleAccess.AD_MODERATOR)
def create_file_connection_bulk(
    data: CreateFileConnectionBulkRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return create_file_connection_bulk_handler(data=data, uow=uow, current_user=current_user)


@router.put("/{file_connection_id}")
@has_access(RoleAccess.AD_MODERATOR)
def update_file_connection(
    file_connection_id: int,
    data: UpdateFileConnectionRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return update_file_connection_handler(
        file_connection_id=file_connection_id, data=data, uow=uow, current_user=current_user
    )


@router.delete("/{file_connection_id}")
@has_access(RoleAccess.AD_MODERATOR)
def delete_file_connection(
    file_connection_id: int,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return delete_file_connection_handler(file_connection_id=file_connection_id, uow=uow, current_user=current_user)
