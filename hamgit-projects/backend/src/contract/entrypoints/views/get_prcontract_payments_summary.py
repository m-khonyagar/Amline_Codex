from contract.domain.enums import PaymentType, PRContractStep
from contract.domain.prcontract.monthly_rent_service import MonthlyRentService
from unit_of_work import UnitOfWork


def get_prcontract_payments_summary_view(contract_id: int, rent_service: MonthlyRentService, uow: UnitOfWork) -> dict:
    with uow:
        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)
        payments = uow.contract_payments.get_by_contract_id(contract_id=contract_id)

        total_rent_payments = sum([payment.amount for payment in payments if payment.type == PaymentType.RENT])
        total_rent_amount = rent_service.calculate_total_rent(prc)

        total_deposit_payments = sum([payment.amount for payment in payments if payment.type == PaymentType.DEPOSIT])

        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id=contract_id)

        step_completed = {step.type for step in contract_steps}

        return {
            "rent_amount": prc.rent_amount,
            "total_rent_amount": total_rent_amount,
            "total_rent_payments": total_rent_payments,
            "remaining_rent_amount": total_rent_amount - total_rent_payments,
            "rent_finalized": PRContractStep.RENT_PAYMENT in step_completed,
            #
            "deposit_amount": prc.deposit_amount,
            "total_deposit_payments": total_deposit_payments,
            "remaining_deposit_amount": prc.deposit_amount - total_deposit_payments if prc.deposit_amount else None,
            "deposit_finalized": PRContractStep.DEPOSIT_PAYMENT in step_completed,
        }
