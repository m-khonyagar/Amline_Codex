from fastapi import APIRouter, Depends

import di
from account.domain.entities.user import User
from advertisement.entrypoints import request_models, response_models, views
from advertisement.service_layer import dtos, handlers
from core.translates import expressions_trans
from core.types import CurrentUser, OperationResult, PaginateParams
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/ads/swaps", tags=["Advertisements"])


@router.get("", response_model=list[response_models.SwapAdResponseModel])
async def get_swap_ads(
    params: PaginateParams = Depends(),
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: User = Depends(di.get_conditional_current_user),
):
    return views.get_swap_ads(current_user, params, uow)


@router.get("/current-user", response_model=list[response_models.SwapAdResponseModel])
async def get_user_swap_ads(
    params: PaginateParams = Depends(),
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_user_swap_ads(current_user.id, params, uow)


@router.get("/{id}", response_model=response_models.SwapAdResponseModel)
async def get_swap_ad(
    id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: User = Depends(di.get_conditional_current_user),
):
    return views.get_swap_ad(current_user, id, uow)


@router.post("", response_model=response_models.SwapAdResponseModel)
async def create_swap_ad(
    request_model: request_models.CreateSwapAdRequest,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.CreateSwapAdDto(**request_model.model_dump())
    return handlers.create_swap_ad_handler(command, uow, current_user)


@router.patch("/{id}", response_model=response_models.SwapAdResponseModel)
async def update_swap_ad(
    id: int,
    request_model: request_models.UpdateSwapAdRequest,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.UpdateSwapAdDto(swap_ad_id=id, **request_model.model_dump())
    return handlers.update_swap_ad_handler(command, uow, current_user)


@router.delete("/{id}", response_model=OperationResult)
async def delete_swap_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.delete_swap_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message=expressions_trans.SWAP_AD_DELETED_SUCCESSFULLY)
