import di
from contract.domain.enums import PaymentType
from contract.domain.events import TenantSignedContractEvent
from core.dtos import GenerateInvoiceDto
from core.logger import Logger
from financial.service_layer.services.invoice_service import InvoiceService
from unit_of_work import SQLAlchemyUnitOfWork

logger = Logger("tenant-signed-event")


def tenant_signed_event_handler(event: TenantSignedContractEvent) -> None:
    uow = SQLAlchemyUnitOfWork(next(di.get_sqlalchemy_session()))
    with uow:
        invoice_service = InvoiceService(uow)
        prcontract = uow.prcontracts.get_by_contract_id(event.contract_id)
        if not prcontract:
            logger.error(f"[prcontract not found] contract_id={event.contract_id}")
            return

        payments = uow.contract_payments.get_by_contract_id(event.contract_id)
        if not payments:
            logger.error(f"[payments not found] contract_id={event.contract_id}")
            return

        for payment in payments:

            if payment.type == PaymentType.COMMISSION:
                continue

            try:
                invoice = invoice_service.generate_invoice(
                    GenerateInvoiceDto(
                        amount=payment.amount,
                        payer_user_id=payment.payer_id,
                        payee_user_id=payment.payee_id,
                        created_by=payment.owner_id,
                    )
                )
                payment.invoice_id = invoice.id
                uow.commit()
                logger.info(f"[invoice_id added to payment] payment_id={payment.id}")
            except Exception as error:
                logger.error(f"[invoice_id adding to payment field] payment_id={payment.id}")
                logger.error(error)
