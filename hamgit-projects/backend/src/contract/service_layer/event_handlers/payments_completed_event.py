import di
from contract.domain.events import ContractPaymentsCompletedEvent
from contract.domain.prcontract import PRContractCommissionService
from contract.service_layer.handlers import (
    admin_generate_prcontract_commissions_handler,
)
from core.logger import Logger
from financial.service_layer.services.invoice_service import InvoiceService
from unit_of_work import SQLAlchemyUnitOfWork

logger = Logger("payments-completed-event")


def contract_payments_completed_event_handler(
    event: ContractPaymentsCompletedEvent,
    commission_service: PRContractCommissionService,
) -> None:
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    invoice_service = InvoiceService(uow)

    admin_generate_prcontract_commissions_handler(
        uow=uow,
        logger=logger,
        contract_id=event.contract_id,
        invoice_service=invoice_service,
        commission_service=commission_service,
    )
