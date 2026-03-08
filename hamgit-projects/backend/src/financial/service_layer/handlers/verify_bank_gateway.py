from fastapi import BackgroundTasks

from core.exceptions import NotFoundException
from core.translates import not_found_trans
from financial.service_layer.dtos import GetBankGatewayDto
from financial.service_layer.services.bank_verified_service import (
    PaymentContext,
    ZarinpalPropertyContractPayment,
)
from unit_of_work import UnitOfWork


def verify_gateway_handler(command: GetBankGatewayDto, uow: UnitOfWork, bg_tasks: BackgroundTasks) -> str:
    with uow:
        transaction = uow.transactions.find_by_authority_code(command.authority_code)

        if not transaction:
            raise NotFoundException(not_found_trans.Transaction)

        context = PaymentContext(ZarinpalPropertyContractPayment(bg_tasks))

        redirect_link = context.verify(transaction)
        uow.commit()

        return redirect_link
