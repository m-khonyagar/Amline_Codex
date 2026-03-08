from fastapi import APIRouter, Depends

import di
from contract.entrypoints import response_models, views
from contract.service_layer import dtos, handlers
from core.types import OperationResult
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.post("/start", status_code=201, response_model=response_models.ContractResponse)
def start_contract(
    data: dtos.StartContractDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
    cache_service=Depends(di.get_cache_service),
):
    contract = handlers.start_contract_handler(current_user=current_user, data=data, uow=uow)

    cache_service.cache_contract_start(contract.id, current_user.mobile)

    return contract.dumps()


@router.get("/list", response_model=list[response_models.UserContractsResponse])
def get_current_user_contracts_list(
    current_user=Depends(di.get_current_user),
    prc_service=Depends(di.get_prcontract_service),
    uow=Depends(di.get_uow),
):
    return views.get_user_contracts_list_view(user=current_user, uow=uow, prc_service=prc_service)


@router.post("/{contract_id}/clauses", response_model=response_models.ContractClauseResponse)
def create_contract_clause(
    contract_id: int,
    data: dtos.CreateContractClauseDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return handlers.create_contract_clause_handler(
        contract_id=contract_id, data=data, user=current_user, uow=uow
    ).dumps()


@router.get("/{contract_id}/clauses", response_model=list[response_models.ContractClauseResponse])
def get_contract_clauses(
    contract_id: int,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return views.get_contract_clauses_list_view(contract_id, current_user, uow)


@router.put("/{contract_id}/clauses/{clause_id}", response_model=response_models.ContractClauseResponse)
def update_contract_clause(
    contract_id: int,
    clause_id: int,
    data: dtos.UpdateContractClauseDto,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    return handlers.update_contract_clause_handler(
        contract_id=contract_id, clause_id=clause_id, clause_body=data.body, user=current_user, uow=uow
    ).dumps()


@router.delete("/{contract_id}/clauses/{clause_id}", response_model=OperationResult)
def delete_contract_clause(
    contract_id: int,
    clause_id: int,
    current_user=Depends(di.get_current_user),
    uow=Depends(di.get_uow),
):
    handlers.delete_contract_clause_handler(contract_id=contract_id, clause_id=clause_id, user=current_user, uow=uow)
    return OperationResult(success=True, message="Clause deleted successfully")


# @router.post("/contracts/commissions")
# def calculate_contract_commission(
#     data: dtos.CalculateContractCommissionDto,
#     current_user=Depends(di.get_current_user),
# ):
#     """
#     need to add sale type to contract types
#     also need to add commission type to contract types
#     TAX = (1, "*", 0.1)
#     DELIVERY = (2, "+", 0)
#     TRACKING_CODE = (3, "+", 50000)
#     TEHRAN_BUYING_COMMISSION = (4, "*", 0.01)  # 1% of the whole price
#     PROVINCES_BUYING_COMMISSION = (5, "*", 0.005)  # 0.5% of the whole price
#     RENT_COMMISSION = (6, "*", 1 / 3)  # rent amount * 1/3
#     MORTGAGE_COMMISSION = (
#         7,
#         "*",
#         0.006,
#     )  # 6000 toman per 1-milion unit of mortgage amount (0.6%)
#     """
#     return handlers.calculate_contract_commission_handler(data=data, user=current_user)
