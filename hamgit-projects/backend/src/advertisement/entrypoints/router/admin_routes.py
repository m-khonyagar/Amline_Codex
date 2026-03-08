from fastapi import APIRouter, Depends, Query

import di
from advertisement.domain.enums import AdStatus, VisitRequestStatus
from advertisement.entrypoints import request_models, response_models, views
from advertisement.service_layer import dtos, handlers
from core.translates import expressions_trans
from core.types import CurrentUser, OperationResult, PaginatedList, PaginateParams
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/admin/ads", tags=["admin"])


# region PROPERTY_AD


@router.get("/properties")
def get_property_ads(
    params: PaginateParams = Depends(),
    status: AdStatus | None = Query(None),
    search_text: str | None = Query(None),
    is_reported: bool = Query(False),
    is_archived: bool = Query(False),
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: CurrentUser = Depends(di.get_admin),
):

    return views.get_admin_property_ads(
        params=params,
        status=status,
        search_text=search_text,
        is_reported=is_reported,
        is_archived=is_archived,
        uow=uow,
    )


@router.get("/properties/{id}", response_model=response_models.PropertyAdResponseModel)
def get_property_ad(
    id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: CurrentUser = Depends(di.get_admin),
):
    return views.get_property_ad(None, id, uow)


@router.post("/properties", response_model=response_models.PropertyAdResponseModel)
async def create_property_ad(
    request_model: request_models.CreateAdminPropertyAdRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.CreateAdminPropertyAdDto(**request_model.model_dump())
    return handlers.create_admin_property_ad_handler(command, uow, current_user)


@router.patch("/properties/{id}", response_model=response_models.PropertyAdResponseModel)
async def update_property_ad(
    id: int,
    request_model: request_models.UpdatePropertyAdRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.UpdatePropertyAdDto(property_ad_id=id, **request_model.model_dump())
    return handlers.update_property_ad_handler(command, uow, current_user)


@router.delete("/properties/{id}", response_model=OperationResult)
async def delete_property_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.delete_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message="Ad deleted successfully.")


@router.post("/properties/{id}/accept", response_model=OperationResult)
async def accept_property_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.accept_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message="Ad accepted successfully.")


@router.post("/properties/{id}/reject", response_model=OperationResult)
async def reject_property_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.reject_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message="Ad rejected successfully.")


@router.post("/properties/{id}/dearchive", response_model=OperationResult)
async def dearchive_property_ad(
    id: int,
    _: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.dearchive_ad_handler(id, uow)
    return OperationResult(success=True, message="Ad dearchived successfully.")


@router.post("/visit-requests/accept", response_model=OperationResult)
async def accept_visit_request(
    request_model: dtos.AcceptVisitRequestDto,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.accept_visit_request_handler(request_model, uow, current_user)
    return OperationResult(success=True, message="Visit Request rejected successfully.")


@router.post("/visit-requests/reject", response_model=OperationResult)
async def reject_visit_request(
    request_model: dtos.RejectVisitRequestDto,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.reject_visit_request_handler(request_model, uow, current_user)
    return OperationResult(success=True, message="Visit Request rejected successfully.")


@router.get("/visit-requests", response_model=PaginatedList)
def get_visit_requests(
    status: VisitRequestStatus = Query(None),
    params: PaginateParams = Depends(),
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: CurrentUser = Depends(di.get_admin),
):
    return views.get_visit_requests_list(status, params, uow)


# region PROPERTY_WANTED_AD


@router.get("/wanted/properties/{id}", response_model=response_models.PropertyWantedAdResponseModel)
def get_property_wanted_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_property_wanted_ad(None, id, uow)


@router.get("/wanted/properties", response_model=PaginatedList)
def get_property_wanted_ads(
    params: PaginateParams = Depends(),
    is_reported: bool = Query(False),
    is_archived: bool = Query(False),
    search_text: str | None = Query(None),
    status: AdStatus | None = None,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):

    return views.get_admin_property_wanted_ads(
        params=params,
        search_text=search_text,
        status=status,
        is_reported=is_reported,
        is_archived=is_archived,
        uow=uow,
    )


@router.post("/wanted/properties", response_model=response_models.PropertyWantedAdResponseModel)
async def create_admin_property_wanted_ad(
    request_model: request_models.CreateAdminPropertyWantedAdRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.CreateAdminPropertyWantedAdDto(**request_model.model_dump())
    return handlers.create_admin_property_wanted_ad_handler(command, uow, current_user)


@router.patch("/wanted/properties/{id}/accept", response_model=OperationResult)
async def accept_property_wanted_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.accept_wanted_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message="Wanted Ad accepted successfully.")


@router.patch("/wanted/properties/{id}/reject", response_model=OperationResult)
async def reject_property_wanted_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.reject_wanted_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message="Wanted Ad rejected successfully.")


@router.post("/wanted/properties/{id}/dearchive", response_model=OperationResult)
async def dearchive_property_wanted_ad(
    id: int,
    _: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.dearchive_wanted_ad_handler(id, uow)
    return OperationResult(success=True, message="Wanted Ad dearchived successfully.")


@router.delete("/wanted/properties/{id}", response_model=OperationResult)
async def delete_property_wanted_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.delete_wanted_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message="Wanted Ad deleted successfully.")


@router.patch("/wanted/properties/{id}", response_model=response_models.PropertyWantedAdResponseModel)
def update_property_wanted_ad(
    id: int,
    request_model: request_models.UpdatePropertyWantedAdRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.UpdatePropertyWantedAdDto(property_wanted_ad_id=id, **request_model.model_dump())
    return handlers.update_property_wanted_ad_handler(command, uow, current_user)


# region SWAP_AD


@router.get("/swaps/{id}", response_model=response_models.SwapAdResponseModel)
def get_swap_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_swap_ad(None, id, uow)


@router.get("/swaps", response_model=PaginatedList)
def get_swap_ads(
    params: PaginateParams = Depends(),
    current_user: CurrentUser = Depends(di.get_admin),
    search_text: str | None = Query(None),
    is_reported: bool = Query(False),
    status: AdStatus | None = None,
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_admin_swap_ads(params, search_text, status, is_reported, uow)


@router.post("/swaps", response_model=response_models.SwapAdResponseModel)
async def create_swap_ad(
    request_model: request_models.CreateAdminSwapAdRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.CreateAdminSwapAdDto(**request_model.model_dump())
    return handlers.create_admin_swap_ad_handler(command, uow, current_user)


@router.patch("/swaps/{id}/accept", response_model=OperationResult)
async def accept_swap_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.accept_swap_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message=expressions_trans.SWAP_AD_ACCEPTED_SUCCESSFULLY)


@router.patch("/swaps/{id}/reject", response_model=OperationResult)
async def reject_swap_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.reject_swap_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message=expressions_trans.SWAP_AD_REJECTED_SUCCESSFULLY)


@router.delete("/swaps/{id}", response_model=OperationResult)
async def delete_swap_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.delete_swap_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message=expressions_trans.SWAP_AD_DELETED_SUCCESSFULLY)


@router.patch("/swaps/{id}", response_model=response_models.SwapAdResponseModel)
def update_swap_ad(
    id: int,
    request_model: request_models.UpdateSwapAdRequest,
    current_user: CurrentUser = Depends(di.get_admin),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.UpdateSwapAdDto(swap_ad_id=id, **request_model.model_dump())
    return handlers.update_swap_ad_handler(command, uow, current_user)
