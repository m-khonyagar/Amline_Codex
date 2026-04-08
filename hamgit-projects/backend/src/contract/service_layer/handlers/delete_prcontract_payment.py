from account.domain.entities.user import User
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PaymentType, PRContractStep
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from contract.service_layer.exceptions import UserIsNotContractPartyException
from core.abstracts.invoice_service import AbstractInvoiceService
from core.exceptions import PermissionException, ProcessingException
from core.translates import perm_trans
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork


def delete_prcontract_payment_handler(
    contract_id: int,
    payment_id: int,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
    invoice_service: AbstractInvoiceService,
) -> ContractPayment:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        contract = uow.contracts.get_or_raise(id=contract_id)
        commissions_steps = uow.contract_steps.get_by_contract_id_and_types(
            contract_id, [PRContractStep.TENANT_COMMISSION, PRContractStep.LANDLORD_COMMISSION]
        )

        if commissions_steps:
            raise ProcessingException(ProcessingExcTrans.after_paying_commission_cannot_delete_payment)

        try:
            party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
            prc_service.validate_party_has_perm_to_delete_payment(prc=prcontract, party=party)

        except (PermissionException, UserIsNotContractPartyException) as exc:
            if not user.is_admin and contract.created_by != user.id:
                raise exc

            # if prcontract.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
            #     raise ContractIsNotEditRequestedException

        payment = uow.contract_payments.get_or_raise(contract_id=contract_id, id=payment_id)

        if payment.type == PaymentType.COMMISSION:
            raise PermissionException(perm_trans.commission_payment_cannot_be_deleted_directly)

        payment.delete()

        if payment.invoice_id:
            invoice_service.delete_invoice(payment.invoice_id)

        commissions = uow.contract_payments.get_contract_commissions(contract_id)

        for commission in commissions:
            commission.delete()
            if commission.invoice_id:
                invoice_service.delete_invoice(commission.invoice_id)

        uow.contract_steps.revoke_step_if_exists(contract_id, PAYMENT_STEP_MAPPER[payment.type])

        uow.commit()
        uow.contract_payments.refresh(payment)
        return payment
