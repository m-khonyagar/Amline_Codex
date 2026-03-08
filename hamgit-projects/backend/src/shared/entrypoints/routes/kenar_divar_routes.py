from fastapi import APIRouter, Depends

import di
from account.service_layer.services.token_service import TokenService
from shared.entrypoints.request_models import KenarDivarLoginRequest
from shared.service_layer.services.kenar_divar.commission_calculator import (
    kenar_divar_commission_calculator_handler,
)
from shared.service_layer.services.kenar_divar.kenar_divar_login import (
    kenar_divar_login_handler,
)
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/kenar-divar", tags=["KenarDivar"])


@router.get("/commission-calculator/{token}")
def get_post_info(token: str):
    return kenar_divar_commission_calculator_handler(token=token)


@router.post("/login")
def kenar_divar_login(
    data: KenarDivarLoginRequest,
    uow: UnitOfWork = Depends(di.get_uow),
    token_service: TokenService = Depends(di.get_token_service),
):
    return kenar_divar_login_handler(data=data, uow=uow, token_service=token_service)
