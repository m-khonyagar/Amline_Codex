from typing import List

from fastapi import APIRouter, Depends, Query

import di
from account.domain.entities.user import User
from advertisement.domain.enums import AdType
from advertisement.entrypoints import request_models, response_models, views
from advertisement.service_layer import dtos, handlers
from core.translates import expressions_trans
from core.types import CurrentUser, OperationResult, PaginateParams
from shared.domain.enums import PropertyType
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/ads/wanted", tags=["Advertisements"])


@router.get("/properties/current-user", response_model=List[response_models.PropertyWantedAdResponseModel])
async def get_user_property_wanted_ads(
    params: PaginateParams = Depends(),
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_user_property_wanted_ads(params, uow, current_user)


@router.get("/properties", response_model=List[response_models.PropertyWantedAdResponseModel])
async def get_property_wanted_ads(
    params: PaginateParams = Depends(),
    type: AdType | None = Query(None),
    city: int | None = Query(None),
    user_city_ids: list[int] | None = Query(None),
    min_meter: int | None = Query(None),
    max_meter: int | None = Query(None),
    min_deposit: int | None = Query(None),
    max_deposit: int | None = Query(None),
    min_rent: int | None = Query(None),
    max_rent: int | None = Query(None),
    min_sale_price: int | None = Query(None),
    max_sale_price: int | None = Query(None),
    room_count: int | None = Query(None),
    min_construction_year: int | None = Query(None),
    max_construction_year: int | None = Query(None),
    districts: List[int] = Query([]),
    elevator: bool = Query(False),
    parking: bool = Query(False),
    storage_room: bool = Query(False),
    property_type: List[PropertyType] = Query([]),
    order_by_cheapest: bool | None = Query(None),
    current_user: User = Depends(di.get_conditional_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    filters = request_models.GetWantedAdFilter(
        type=type,
        city=city,
        user_city_ids=user_city_ids,
        min_meter=min_meter,
        max_meter=max_meter,
        min_deposit=min_deposit,
        max_deposit=max_deposit,
        min_rent=min_rent,
        max_rent=max_rent,
        min_sale_price=min_sale_price,
        max_sale_price=max_sale_price,
        room_count=room_count,
        min_construction_year=min_construction_year,
        max_construction_year=max_construction_year,
        districts=districts,
        storage_room=storage_room,
        parking=parking,
        elevator=elevator,
        property_type=property_type,
        order_by_cheapest=order_by_cheapest,
    )
    return views.get_property_wanted_ads(current_user, params, filters, uow)


@router.get("/properties/{id}", response_model=response_models.PropertyWantedAdResponseModel)
async def get_property_wanted_ad(
    id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: User = Depends(di.get_conditional_current_user),
):
    return views.get_property_wanted_ad(current_user, id, uow)


@router.post("/properties", response_model=response_models.PropertyWantedAdResponseModel)
async def create_property_wanted_ad(
    request_model: request_models.CreatePropertyWantedAdRequest,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.CreatePropertyWantedAdDto(**request_model.model_dump())
    return handlers.create_property_wanted_ad_handler(command, uow, current_user)


@router.patch("/properties/{id}", response_model=response_models.PropertyWantedAdResponseModel)
async def update_property_wanted_ad(
    id: int,
    request_model: request_models.UpdatePropertyWantedAdRequest,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    command = dtos.UpdatePropertyWantedAdDto(property_wanted_ad_id=id, **request_model.model_dump())
    return handlers.update_property_wanted_ad_handler(command, uow, current_user)


@router.delete("/properties/{id}", response_model=OperationResult)
async def delete_property_wanted_ad(
    id: int,
    current_user: CurrentUser = Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    handlers.delete_wanted_ad_handler(id, uow, current_user)
    return OperationResult(success=True, message=expressions_trans.WANTED_AD_DELETED_SUCCESSFULLY)


@router.get("/properties/{id}/similar-wanted-ads", response_model=list[response_models.PropertyWantedAdResponseModel])
async def view_similar_property_wanted_ads(
    id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: User = Depends(di.get_conditional_current_user),
):
    return views.get_similar_property_wanted_ads(current_user, id, uow)


@router.get("/properties/{id}/similar-ads", response_model=list[response_models.PropertyAdResponseModel])
async def view_similar_property_ads_for_a_wanted_ad(
    id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    current_user: User = Depends(di.get_conditional_current_user),
):
    return views.get_similar_ads_for_wanted_ad(current_user, id, uow)
