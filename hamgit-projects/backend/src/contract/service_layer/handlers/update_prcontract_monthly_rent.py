from account.domain.entities.user import User
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.monthly_rent_service import MonthlyRentService
from contract.service_layer.dtos import UpdatePRContractMonthlyRentDto
from core.exceptions import ValidationException
from core.translates import validation_trans
from unit_of_work import UnitOfWork


def update_prcontract_monthly_rent_handler(
    contract_id: int,
    data: UpdatePRContractMonthlyRentDto,
    user: User,
    uow: UnitOfWork,
    prc_service: PRContractService,
    monthly_rent_service: MonthlyRentService,
) -> PropertyRentContract:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_party_or_raise(contract_id, user.id, user.roles)
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=PRContractStep.MONTHLY_RENT
        )

        if data.monthly_rent_amount <= 0:
            raise ValidationException(validation_trans.rent_amount_should_be_positive)

        prcontract.update(rent_amount=data.monthly_rent_amount)

        rent_payment_step = uow.contract_steps.get_by_contract_id_and_type(contract_id, PRContractStep.RENT_PAYMENT)

        if rent_payment_step:
            rent_payment_step.revoke()

        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.MONTHLY_RENT)

        uow.commit()
        uow.prcontracts.refresh(prcontract)
        prcontract.total_rent_amount = monthly_rent_service.calculate_total_rent(prcontract)

        return prcontract
