from fastapi import APIRouter, Depends

import di
from account.entrypoints import response_models
from account.service_layer import dtos, handlers
from unit_of_work import UnitOfWork

router = APIRouter(prefix="/bank-accounts", tags=["bank accounts"])


@router.post("", response_model=response_models.BankAccountResponse, status_code=201)
def create_bank_account(
    data: dtos.CreateBankAccountDto,
    current_user=Depends(di.get_current_user),
    uow: UnitOfWork = Depends(di.get_uow),
):
    return handlers.create_bank_account_handler(data=data, current_user=current_user, uow=uow).dumps()
