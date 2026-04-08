from fastapi import APIRouter, Depends, Query

import di
from contract.domain.enums import PaymentSide
from contract.entrypoints import request_models, views
from contract.service_layer import dtos, handlers
from core.types import PaginatedList, PaginateParams

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/payments", response_model=PaginatedList)
def get_user_payments(
    payment_side: PaymentSide | None = Query(None),
    params: PaginateParams = Depends(),
    user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return views.get_user_payments_list_view(payment_side=payment_side, params=params, user=user, uow=uow)


@router.post("/calculate/rent-commission")
async def calculate_rent_commission(
    request_model: request_models.CalculateRentCommissionRequest,
    commission_service=Depends(di.get_prcontract_commission_service),
):
    command = dtos.CalculateRentCommissionDto(**request_model.model_dump())
    return handlers.calculate_rent_commission_handler(command, commission_service)


@router.post("/calculate/sale-commission")
async def calculate_sale_commission(
    request_model: request_models.CalculateSaleCommissionRequest,
    commission_service=Depends(di.get_prcontract_commission_service),
):
    command = dtos.CalculateSaleCommissionDto(**request_model.model_dump())
    return handlers.calculate_sale_commission_handler(command=command, commission_service=commission_service)
