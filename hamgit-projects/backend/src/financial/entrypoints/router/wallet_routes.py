from fastapi import APIRouter, Depends

import di
from core.exceptions import ServiceUnavailableException
from core.types import CurrentUser, OperationResult, PaginateParams
from financial.entrypoints import response_models, views
from financial.service_layer import handlers
from financial.service_layer.dtos import CreateSettlementDto
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/financials/wallets", tags=["Financial"])


@router.get("", response_model=response_models.WalletResponseModel)
async def get_current_user_wallet(
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_user_wallet(uow, current_user)


@router.get("/transactions")
async def get_current_user_wallet_transactions(
    params: PaginateParams = Depends(),
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_user_wallet_transactions(uow, current_user, params)


@router.post("/charge", response_model=response_models.InvoiceResponseModel)
async def create_wallet_charge_invoice(
    credit_charge_amount: int,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    raise ServiceUnavailableException(detail="این سرویس موقتا غیر فعال است")
    # return handlers.create_charge_wallet_invoice_handler(credit_charge_amount, uow, current_user)


@router.post("", response_model=response_models.WalletResponseModel)
async def admin_create_user_wallet(
    mobile: str,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return handlers.create_wallet_handler(uow, current_user, mobile)


# -------------------settlements----------------------


@router.get("/settlements")
async def view_user_wallet_settlements(
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_user_wallet_settlements(uow, current_user)


@router.post("/settlements", response_model=OperationResult)
async def create_wallet_settlement_request(
    request_model: CreateSettlementDto,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    raise ServiceUnavailableException(detail="این سرویس موقتا غیر فعال است")
    # handlers.create_settlement_request_handler(uow, current_user, request_model)
    # return OperationResult(success=True, message="درخواست با موفقیت ثبت شد")
