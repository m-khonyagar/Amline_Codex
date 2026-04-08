from account.domain.entities.user import User
from contract.domain.entities.contract_payment import ContractPayment
from contract.domain.enums import PartyType, PaymentMethod, PaymentType
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from contract.service_layer.dtos import PrContractCashPaymentDto
from core.exceptions import ProcessingException
from core.translates import processing_trans
from unit_of_work import UnitOfWork


def create_prcontract_cash_payment_handler(
    contract_id: int, data: PrContractCashPaymentDto, user: User, uow: UnitOfWork, prc_service: PRContractService
) -> ContractPayment:

    PAYMENT_TYPE = PaymentType.resolve(data.payment_type)
    STEP = PAYMENT_STEP_MAPPER[PAYMENT_TYPE]

    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)

        tenant = uow.contract_parties.get(contract_id=contract_id, party_type=PartyType.TENANT)
        if not tenant:
            raise ProcessingException(processing_trans.both_parties_required_for_creating_payment)

        landlord = uow.contract_parties.get(contract_id=contract_id, party_type=PartyType.LANDLORD)
        if not landlord:
            raise ProcessingException(processing_trans.both_parties_required_for_creating_payment)
        party = tenant if tenant.user_id == user.id else landlord

        completed_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=STEP, completed_steps=completed_steps
        )

        if PAYMENT_TYPE == PaymentType.DEPOSIT and prcontract.deposit_amount is None:
            raise ProcessingException(processing_trans.deposit_amount_not_set)

        elif PAYMENT_TYPE == PaymentType.RENT and prcontract.rent_amount is None:
            raise ProcessingException(processing_trans.monthly_rent_amount_not_set)

        payment = ContractPayment(
            contract_id=contract_id,
            payer_id=tenant.user_id,
            payee_id=landlord.user_id,
            amount=data.amount,
            method=PaymentMethod.CASH,
            type=PAYMENT_TYPE,
            due_date=data.due_date,
            owner_id=user.id,
            description=data.description,
        )

        uow.contract_payments.add(payment)

        uow.commit()
        uow.contract_payments.refresh(payment)
        return payment
