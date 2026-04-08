from logging import Logger

from fastapi import APIRouter, Depends

import di
from account.domain.entities.user import User
from account.domain.enums import RoleAccess
from account.entrypoints import response_models, views
from account.entrypoints.request_models import (
    UserCallCreateRequest,
    UserTextCreateRequest,
)
from account.service_layer import dtos, handlers
from account.service_layer.handlers.create_user_call import create_user_call_handler
from account.service_layer.handlers.create_user_text import create_user_text_handler
from account.service_layer.handlers.get_user_call_by_user_id import (
    get_user_calls_by_user_id,
)
from account.service_layer.handlers.get_user_text_by_user_id import (
    get_user_texts_by_user_id,
)
from core.middlewares.access_checker import has_access
from core.translates import expressions_trans
from core.types import OperationResult
from crm.service_layer.handlers.get_file_call_by_file_id import (
    get_file_calls_by_user_id,
)
from crm.service_layer.handlers.get_file_text_by_file_id import (
    get_file_texts_by_user_id,
)
from unit_of_work import UnitOfWork

logger = Logger("user-routes")

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=response_models.UserResponse)
def get_current_user_detail(user: User = Depends(di.get_current_user)):
    return user.dumps()


@router.put("/update", response_model=response_models.UserResponse)
def update_current_user(
    data: dtos.UpdateUserDto,
    user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    storage=Depends(di.get_storage_service),
):
    return handlers.update_user_handler(data=data, user_id=user.id, uow=uow, storage=storage).dumps()


@router.patch("/nickname", response_model=response_models.UserResponse)
def update_nickname(data: dtos.UpdateNicknameDto, user: User = Depends(di.get_current_user), uow=Depends(di.get_uow)):
    return handlers.update_nickname_handler(data=data, user_id=user.id, uow=uow).dumps()


@router.get("/saved-ads")
def get_user_saved_ads(
    user: User = Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return views.get_user_saved_ads_list(user.id, uow)


@router.post("/saved-ads", response_model=OperationResult)
def save_ad(
    data: dtos.CreateSavedAdDto,
    user: User = Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    result = handlers.save_ad_handler(data=data, user_id=user.id, uow=uow)
    return OperationResult(success=result, message=expressions_trans.AD_SUBMITTED_SUCCESSFULLY)


@router.delete("/saved-ads/{ad_id}", response_model=OperationResult)
def delete_saved_ad(
    ad_id: int,
    user: User = Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    result = handlers.delete_saved_ad_handler(ad_id=ad_id, user_id=user.id, uow=uow)
    return OperationResult(success=result, message=expressions_trans.AD_DELETED_SUCCESSFULLY)


@router.delete("/user-profile")
def delete_user_profile(
    user: User = Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    storage=Depends(di.get_storage_service),
):
    result = handlers.delete_user_profile_handler(user_id=user.id, uow=uow, storage=storage)
    return OperationResult(success=result, message=expressions_trans.USER_PROFILE_DELETED_SUCCESSFULLY)


@router.post("/user-calls")
@has_access(RoleAccess.STAFF)
def create_user_call(
    data: UserCallCreateRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return create_user_call_handler(data=data, uow=uow, current_user=current_user)


@router.get("/user-calls/{user_id}")
@has_access(RoleAccess.STAFF)
def get_user_calls(user_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_user_calls_by_user_id(user_id=user_id, uow=uow)


@router.get("/user-texts/{user_id}")
@has_access(RoleAccess.STAFF)
def get_user_texts(user_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_user_texts_by_user_id(user_id=user_id, uow=uow)


@router.get("/file-calls/{user_id}")
@has_access(RoleAccess.STAFF)
def get_file_calls(user_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_file_calls_by_user_id(user_id=user_id, uow=uow)


@router.get("/file-texts/{user_id}")
@has_access(RoleAccess.STAFF)
def get_file_texts(user_id: int, uow: UnitOfWork = Depends(di.get_uow), _: User = Depends(di.get_current_user)):
    return get_file_texts_by_user_id(user_id=user_id, uow=uow)


@router.post("/user-texts")
@has_access(RoleAccess.STAFF)
def create_user_text(
    data: UserTextCreateRequest,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
    sms_service=Depends(di.get_sms_service),
):
    return create_user_text_handler(data=data, uow=uow, current_user=current_user, sms_service=sms_service)
