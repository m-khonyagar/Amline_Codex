from fastapi import APIRouter, BackgroundTasks, Body, Depends, UploadFile

import di
from core.types import CurrentUser
from financial.entrypoints.request_models import WalletManualChargeRequest
from financial.service_layer import handlers
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/admin", tags=["admin wallets"])


@router.post("/financials/wallets/manual-charge")
async def admin_manual_charge(
    data: WalletManualChargeRequest,
    bg_tasks: BackgroundTasks,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return await handlers.admin_manual_charge_handler(data=data, current_user=current_user, uow=uow, bg_tasks=bg_tasks)


@router.post("/financials/wallets/bulk-manual-charge")
async def admin_bulk_manual_charge(
    file: UploadFile,
    bg_tasks: BackgroundTasks,
    text_message: str | None = Body(default=None),
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return await handlers.admin_bulk_manual_charge_handler(
        file=file, text_message=text_message, current_user=current_user, uow=uow, bg_tasks=bg_tasks
    )
