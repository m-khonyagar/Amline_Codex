from core.dtos import GenerateInvoiceDto
from core.exceptions import NotFoundException
from financial.service_layer.services.invoice_service import InvoiceService
from unit_of_work import UnitOfWork


def create_invoice_manually_handler(contract_id, uow: UnitOfWork, invoice_service: InvoiceService) -> bool:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id(contract_id)
        if not prcontract:
            raise NotFoundException(detail="pr_contract not found")

        payments = uow.contract_payments.get_by_contract_id(contract_id)
        if not payments:
            raise NotFoundException(detail="payments not found")

        for payment in payments:
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
        return True
