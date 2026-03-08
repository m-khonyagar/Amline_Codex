from fastapi import BackgroundTasks

from core.exceptions import NotFoundException
from core.translates import not_found_trans
from financial.service_layer.services.bank_verified_service import (
    ParsianPropertyContractPayment,
    PaymentContext,
)
from unit_of_work import UnitOfWork


def verify_parsian_gateway_handler(command: dict, uow: UnitOfWork, bg_tasks: BackgroundTasks) -> str:
    with uow:
        transaction = uow.transactions.find_by_authority_code(command["token"])
        if not transaction:
            raise NotFoundException(not_found_trans.Transaction)

        context = PaymentContext(ParsianPropertyContractPayment(bg_tasks))
        transaction.description = str(command)

        redirect_link = context.verify(transaction)
        uow.commit()

        return redirect_link
