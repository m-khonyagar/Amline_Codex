from fastapi import APIRouter, Depends, Request

import di
from account.domain.entities.user import User
from shared.entrypoints import response_models, views
from shared.entrypoints.request_models import (
    CreateDistrictRequestModel,
    UpdateDistrictRequestModel,
)
from shared.service_layer.handlers.district_handlers import (
    create_district_handler,
    delete_district_handler,
    update_district_handler,
)
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/provinces", tags=["Cities"])


@router.get("/cities", response_model=list[response_models.CityResponseModel])
def get_cities(
    request: Request,
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.all_cities_view(uow)


@router.get("/cities/{city_id:int}", response_model=response_models.CityResponseModel)
def get_city(city_id: int, uow=Depends(di.get_uow)):
    return views.city_detail_view(city_id, uow)


@router.get("", response_model=list[response_models.ProvinceResponseModel])
def get_provinces(
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.all_provinces_view(uow)


@router.get("/{province_id:int}", response_model=list[response_models.ProvinceResponseModel])
def get_province_cities(
    province_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.all_province_cities_view(province_id, uow)


@router.get("/cities/{city_id:int}/districts", response_model=list[response_models.DistrictResponseModel])
def get_city_districts(
    request: Request,
    city_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.all_city_districts_view(city_id, uow)


@router.post("/cities/{city_id:int}/districts", status_code=201)
def create_district(
    city_id: int,
    data: CreateDistrictRequestModel,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return create_district_handler(city_id=city_id, name=data.name, region=data.region, uow=uow)


@router.put("/districts/{district_id:int}", status_code=200)
def update_district(
    district_id: int,
    data: UpdateDistrictRequestModel,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return update_district_handler(district_id=district_id, data=data, uow=uow)


@router.delete("/districts/{district_id:int}", status_code=200)
def delete_district(
    district_id: int,
    uow: UnitOfWork = Depends(di.get_uow),
    _: User = Depends(di.get_current_user),
):
    return delete_district_handler(district_id=district_id, uow=uow)
