from datetime import date

from account.domain.entities.user import User
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PartyType, PaymentMethod, PaymentType, PRContractStep
from contract.domain.prcontract import MonthlyRentService, PRContractService
from contract.service_layer.dtos import PrContractMonthlyRentPaymentDto
from core.abstracts.invoice_service import AbstractInvoiceService
from core.exceptions import ProcessingException, ValidationException
from core.translates import processing_trans, validation_trans
from unit_of_work import UnitOfWork


def create_prcontract_monthly_rent_payment_handler(
    contract_id: int,
    data: PrContractMonthlyRentPaymentDto,
    uow: UnitOfWork,
    user: User,
    prc_service: PRContractService,
    monthly_rent_service: MonthlyRentService,
    invoice_service: AbstractInvoiceService,
) -> list[ContractPayment]:

    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        tenant = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=PartyType.TENANT)
        landlord = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=PartyType.LANDLORD)
        party = tenant if prcontract.owner.party_type == PartyType.TENANT else landlord
        try:
            prc_service.validate_party_has_permission_for_step(
                prc=prcontract, party=party, step=PRContractStep.RENT_PAYMENT, completed_steps=contract_steps
            )
        except Exception as exc:
            if not user.is_contract_admin:
                raise exc

            # if prcontract.status not in [ContractStatus.EDIT_REQUESTED, ContractStatus.ADMIN_STARTED]:
            #     raise ContractIsNotEditRequestedException

        if not prcontract.start_date or not prcontract.end_date or not prcontract.rent_amount:
            raise ProcessingException(processing_trans.contract_information_not_set)

        if not 1 <= data.day_of_month <= 31:
            raise ValidationException(validation_trans.invalid_day_of_month)

        existing_payments = uow.contract_payments.get_by_contract_id(
            contract_id=contract_id, payment_type=PaymentType.RENT
        )

        if existing_payments:
            for existing_payment in existing_payments:
                existing_payment.delete()
                if existing_payment.invoice_id:
                    invoice_service.delete_invoice(existing_payment.invoice_id)

        prcontract.update(rent_day=data.day_of_month)

        rent_schedule: list[tuple[date, int]] = monthly_rent_service.generate_rent_schedule(prcontract)

        uow.contract_steps.revoke_step_if_exists(
            contract_id=contract_id,
            step_type=PRContractStep.RENT_PAYMENT,
        )

        payments = [
            ContractPayment(
                contract_id=contract_id,
                type=PaymentType.RENT,
                method=PaymentMethod.CASH,
                amount=amount,
                due_date=date,
                payer_id=tenant.user_id,
                payee_id=landlord.user_id,
                owner_id=user.id,
                is_bulk=True,
            )
            for date, amount in rent_schedule
        ]

        uow.contract_payments.add_all(payments)
        uow.commit()

        uow.contract_payments.refresh_all(payments)
        return payments
