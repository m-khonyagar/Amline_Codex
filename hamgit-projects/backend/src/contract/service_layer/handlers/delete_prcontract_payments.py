from account.domain.entities.user import User
from contract.domain.enums import PaymentType
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from core.abstracts.invoice_service import AbstractInvoiceService
from unit_of_work import UnitOfWork


def delete_prcontract_payments_handler(
    contract_id: int,
    user: User,
    uow: UnitOfWork,
    payment_type: str,
    prc_service: PRContractService,
    invoice_service: AbstractInvoiceService,
) -> None:
    with uow:
        PT = PaymentType.resolve(payment_type)
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)

        prc_service.validate_party_has_perm_to_delete_payment(prc=prcontract, party=party)

        payments = uow.contract_payments.get_by_contract_id(contract_id, PT)

        for payment in payments:
            payment.delete()
            if payment.invoice_id:
                invoice_service.delete_invoice(payment.invoice_id)

        if contract_step := uow.contract_steps.get_by_contract_id_and_type(contract_id, PAYMENT_STEP_MAPPER[PT]):
            contract_step.revoke()

        uow.commit()
