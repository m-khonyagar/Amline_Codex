from fastapi import APIRouter, Depends

import di
from account.service_layer.services.token_service import TokenService
from shared.entrypoints.request_models import EitaaLoginRequest, EitaaLoginWithIdRequest
from shared.service_layer.services.eitaa.login_with_eitaa import (
    login_with_eitaa_handler,
    login_with_eitaa_user_id_handler,
)
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/eitaa", tags=["Eitaa"])


@router.post("/login")
def login_with_eitaa(
    data: EitaaLoginRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    token_service: TokenService = Depends(di.get_token_service),
):
    return login_with_eitaa_handler(uow=uow, token_service=token_service, data=data.response)


@router.post("/login_with_id")
def login_with_eitaa_user_id(
    data: EitaaLoginWithIdRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    token_service: TokenService = Depends(di.get_token_service),
):
    return login_with_eitaa_user_id_handler(
        uow=uow,
        token_service=token_service,
        eitaa_user_id=data.eitaa_user_id,
    )
