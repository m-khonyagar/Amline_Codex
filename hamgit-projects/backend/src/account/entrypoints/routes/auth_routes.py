from fastapi import APIRouter, Depends, Request

import di
from account.entrypoints import response_models
from account.entrypoints.request_models import RealtorRegisterRequest
from account.service_layer import dtos, handlers
from core.middlewares.rate_limiter import login_rate_limiter, throttling
from core.translates import auth_trans, expressions_trans
from core.types import OperationResult

router = APIRouter(prefix="/auth", tags=["authentication"])


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
    handlers.call_authentication_voip_otp_handler(request=request,mobile=data.mobile,voip_service= voip_service, cache=cache)
    return OperationResult(success=True, message=expressions_trans.OTP_SENT)





@router.post("/otp/verify", response_model=response_models.TokenResponse)
def verify_authentication_otp(
    request: Request,
    data: dtos.VerifyAuthenticationOtpDto,
    cache_service=Depends(di.get_cache_service),
    uow=Depends(di.get_uow),
    token_service=Depends(di.get_token_service),
):
    return handlers.verify_authentication_otp_handler(
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


@router.post("/realtor/register")
def realtor_register(
    data: RealtorRegisterRequest,
    verifier=Depends(di.get_user_verifier_service),
    uow=Depends(di.get_uow),
):
    return handlers.realtor_register_handler(uow=uow, data=data, verifier=verifier)
