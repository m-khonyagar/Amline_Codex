from account.domain.entities.user import User
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import UpdatePrContractDepositDto
from core.exceptions import ValidationException
from core.translates import validation_trans
from unit_of_work import UnitOfWork


def update_prcontract_deposit_handler(
    contract_id: int, data: UpdatePrContractDepositDto, user: User, uow: UnitOfWork, prc_service: PRContractService
) -> PropertyRentContract:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_party_or_raise(contract_id, user.id, user.roles)
        prc_service.validate_party_has_permission_for_step(prc=prcontract, party=party, step=PRContractStep.DEPOSIT)

        if data.deposit_amount < 0:
            raise ValidationException(validation_trans.deposit_amount_should_be_positive)

        deposit_payment_step = uow.contract_steps.get_by_contract_id_and_type(
            contract_id, PRContractStep.DEPOSIT_PAYMENT
        )

        if deposit_payment_step:
            deposit_payment_step.revoke()

        prcontract.update(deposit_amount=data.deposit_amount)

        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.DEPOSIT)

        uow.commit()
        uow.prcontracts.refresh(prcontract)
        return prcontract
