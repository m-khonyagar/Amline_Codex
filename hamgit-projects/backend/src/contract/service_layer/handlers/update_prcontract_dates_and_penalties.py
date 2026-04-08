from account.domain.entities.user import User
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import PaymentType, PRContractStep
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.monthly_rent_service import MonthlyRentService
from contract.service_layer.dtos import UpdatePRContractDatesAndPenaltiesDto
from core.abstracts.invoice_service import AbstractInvoiceService
from core.exceptions import ValidationException
from core.translates import validation_trans
from unit_of_work import UnitOfWork


def update_prcontract_dates_and_penalties_handler(
    contract_id: int,
    data: UpdatePRContractDatesAndPenaltiesDto,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
    invoice_service: AbstractInvoiceService,
    monthly_rent_service: MonthlyRentService,
) -> PropertyRentContract:

    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=PRContractStep.DATES_AND_PENALTIES
        )

        DELETE_PAYMENTS = False

        if prcontract.start_date and data.start_date and prcontract.start_date != data.start_date:
            DELETE_PAYMENTS = True

        if prcontract.end_date and data.end_date and prcontract.end_date != data.end_date:
            DELETE_PAYMENTS = True

        if data.start_date >= data.end_date:
            raise ValidationException(validation_trans.end_date_should_be_after_start_date)

        if data.landlord_penalty_fee <= 0 or data.tenant_penalty_fee <= 0:
            raise ValidationException(validation_trans.penalty_fee_should_be_positive)

        if data.property_handover_date > data.end_date:
            raise ValidationException(validation_trans.property_handover_date_should_be_before_end_date)

        prcontract.update(
            date=data.contract_date,
            start_date=data.start_date,
            end_date=data.end_date,
            property_handover_date=data.property_handover_date,
            landlord_penalty_fee=data.landlord_penalty_fee,
            tenant_penalty_fee=data.tenant_penalty_fee,
        )

        if DELETE_PAYMENTS:
            rent_payments = uow.contract_payments.get_by_contract_id(contract_id, payment_type=PaymentType.RENT)
            for rent_payment in rent_payments:
                rent_payment.delete()
                if rent_payment.invoice_id:
                    invoice_service.delete_invoice(rent_payment.invoice_id)
            uow.contract_steps.revoke_step_if_exists(contract_id, PRContractStep.RENT_PAYMENT)

        try:
            prcontract.total_rent_amount = monthly_rent_service.calculate_total_rent(prcontract)
        except ValidationException:
            pass

        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.DATES_AND_PENALTIES)

        uow.commit()
        uow.prcontracts.refresh(prcontract)

        return prcontract
