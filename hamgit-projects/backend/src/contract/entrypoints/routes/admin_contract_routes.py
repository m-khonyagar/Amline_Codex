from fastapi import APIRouter, Depends

import di
from account.domain.enums import RoleAccess
from contract.entrypoints import response_models
from contract.service_layer import dtos, handlers
from contract.service_layer.handlers.create_empty_contract import (
    create_empty_contract_handler,
)
from core.middlewares.access_checker import has_access

router = APIRouter(prefix="/admin/contracts", tags=["admin contracts"])


@router.post("/start", status_code=201, response_model=response_models.ContractResponse)
def start_contract(
    data: dtos.AdminStartContractDto,
    _=Depends(di.get_admin),
    uow=Depends(di.get_uow),
    current_user=Depends(di.get_admin),
):
    return handlers.admin_start_contract_handler(data=data, uow=uow, current_user=current_user).dumps()


@router.post("/realtor-start", status_code=201, response_model=response_models.ContractResponse)
def realtor_start_contract(
    data: dtos.RealtorStartContractRequest,
    current_user=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
    verifier=Depends(di.get_user_verifier_service),
):
    return handlers.realtor_start_contract_handler(
        data=data,
        verifier=verifier,
        uow=uow,
        current_user=current_user,
    )


@router.post("/create-empty", status_code=201)
@has_access(role_access=RoleAccess.EMPTY_CONTRACT_CREATOR)
def create_empty_contract(
    data: dtos.CreateEmptyContractDto,
    current_user=Depends(di.get_admin),
    uow=Depends(di.get_uow),
):
    return create_empty_contract_handler(data=data, current_user=current_user, uow=uow)


@router.post("/descriptions", status_code=201)
def create_contract_description(
    data: dtos.CreateContractDescriptionDto,
    current_user=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    return handlers.create_contract_description_handler(data=data, current_user=current_user, uow=uow)


@router.get("/descriptions/{contract_id}")
def get_contract_descriptions(
    contract_id: int,
    _=Depends(di.get_contract_admin),
    uow=Depends(di.get_uow),
):
    descriptions = handlers.get_contract_descriptions_handler(contract_id=contract_id, uow=uow)
    return descriptions
