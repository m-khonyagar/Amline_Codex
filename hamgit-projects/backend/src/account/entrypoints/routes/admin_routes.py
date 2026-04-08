from fastapi import APIRouter, Depends, Query, Request

import di
from account.domain.enums import RoleAccess, UserCallStatus, UserRole
from account.entrypoints import response_models, views
from account.entrypoints.response_models import UserResponse
from account.service_layer import dtos, handlers
from account.service_layer.handlers import generate_token_as_user_for_admin_handler
from account.service_layer.handlers.user_existence import user_existence_handler
from core.middlewares.access_checker import has_access
from core.middlewares.rate_limiter import login_rate_limiter, throttling
from core.translates import auth_trans, expressions_trans
from core.types import OperationResult, PaginatedList, PaginateParams

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login")
def admin_login_with_password(
    data: dtos.AdminLoginDto,
    token_service=Depends(di.get_token_service),
    uow=Depends(di.get_uow),
):
    return handlers.admin_login_handler(data=data, token_service=token_service, uow=uow)


@router.post("/otp/send", response_model=OperationResult)
@throttling(limit=600, period=3600)
@login_rate_limiter(limit=5, period=60)
def send_authentication_otp(
    request: Request,
    data: dtos.SendAuthenticationOtpDto,
    sms_service=Depends(di.get_sms_service),
    cache=Depends(di.get_cache_service),
):
    handlers.send_authentication_otp_handler(mobile=data.mobile, sms_service=sms_service, cache=cache)
    return OperationResult(success=True, message=expressions_trans.OTP_SENT)


@router.post("/voip-otp", response_model=OperationResult)
@throttling(limit=600, period=3600)
@login_rate_limiter(limit=5, period=60)
def call_authentication_voip_otp(
    request: Request,
    data: dtos.SendAuthenticationOtpDto,
    voip_service=Depends(di.get_voip_service),
    cache=Depends(di.get_cache_service),
):
    handlers.call_authentication_voip_otp_handler(request=request, mobile=data.mobile,voip_service= voip_service, cache=cache)
    return OperationResult(success=True, message=expressions_trans.OTP_SENT)


@router.post("/otp/verify", response_model=response_models.TokenResponse)
def verify_authentication_otp(
    request: Request,
    data: dtos.VerifyAuthenticationOtpDto,
    cache_service=Depends(di.get_cache_service),
    uow=Depends(di.get_uow),
    token_service=Depends(di.get_token_service),
):
    return handlers.verify_admin_authentication_otp_handler(
        data=data, cache_service=cache_service, uow=uow, token_service=token_service
    )


@router.post("/token/refresh", response_model=response_models.TokenResponse)
def refresh_access_token(
    data: dtos.RefreshAccessTokenDto,
    token_service=Depends(di.get_token_service),
    uow=Depends(di.get_uow),
):
    return handlers.refresh_access_token_handler(refresh_token=data.refresh_token, token_service=token_service, uow=uow)


@router.post("/logout", response_model=OperationResult)
def logout(request: Request, token_service=Depends(di.get_token_service)):
    handlers.revoke_user_tokens_handler(
        authorization_header=request.headers.get("Authorization"), token_service=token_service
    )
    return OperationResult(success=True, message=auth_trans.logged_out_successfully)


@router.get("/users", response_model=PaginatedList)
@has_access(RoleAccess.STAFF)
def get_all_users(
    _=Depends(di.get_admin),
    query_params: PaginateParams = Depends(),
    search_text: str | None = Query(None),
    role: UserRole | None = Query(None),
    last_call_status: UserCallStatus | None = Query(None),
    uow=Depends(di.get_uow),
):
    return views.get_users_list_view(
        params=query_params,
        search_text=search_text,
        last_call_status=last_call_status,
        role=role,
        uow=uow,
    )


@router.put("/users/create-or-update")
@has_access(RoleAccess.STAFF)
def create_or_update_user(
    data: dtos.CreateUserDto,
    uow=Depends(di.get_uow),
    verifier=Depends(di.get_user_verifier_service),
    current_user=Depends(di.get_admin),
):
    return handlers.upsert_user_handler(data=data, uow=uow, verifier=verifier, current_user=current_user)


@router.get("/users/{user_id}")
@has_access(RoleAccess.STAFF)
def get_user_detail(user_id: int, _=Depends(di.get_admin), uow=Depends(di.get_uow)):
    return views.get_user_detail_view(user_id=user_id, uow=uow)


@router.post("/users/{user_id}/access-token")
@has_access(RoleAccess.STAFF)
def get_token_as_user(
    user_id: int,
    _=Depends(di.get_admin),
    token_service=Depends(di.get_token_service),
    uow=Depends(di.get_uow),
):
    return generate_token_as_user_for_admin_handler(user_id=user_id, token_service=token_service, uow=uow)


@router.get("/users/{user_id}/stats")
@has_access(RoleAccess.STAFF)
def get_user_statistics(user_id: int, _=Depends(di.get_admin), uow=Depends(di.get_uow)):
    return views.get_user_stats(user_id, uow)


@router.get("/stats")
@has_access(RoleAccess.STAFF)
def get_public_statistics(_=Depends(di.get_admin), uow=Depends(di.get_uow)):
    return views.get_total_stats(uow)


@router.post("/users/verify-information", response_model=UserResponse)
@has_access(RoleAccess.STAFF)
def verify_user_information(
    data: dtos.VerifyUserInformationDto,
    _=Depends(di.get_admin),
    verifier=Depends(di.get_user_verifier_service),
    uow=Depends(di.get_uow),
):
    return handlers.verify_user_information_handler(data=data, verifier=verifier, uow=uow).dumps()


@router.get("/user-existence/{mobile}")
@has_access(RoleAccess.STAFF)
def user_existence(mobile: str, uow=Depends(di.get_uow), _=Depends(di.get_admin)):
    return user_existence_handler(mobile=mobile, uow=uow)
