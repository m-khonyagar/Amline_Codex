from account.domain.entities.user import User
from contract.domain.entities import ContractPayment
from contract.domain.enums import PartyType, PaymentMethod, PaymentType
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.steps_mapper import PAYMENT_STEP_MAPPER
from contract.service_layer.dtos import PrContractChequePaymentDto
from core.exceptions import ProcessingException
from core.translates import processing_trans
from unit_of_work import UnitOfWork


def create_prcontract_cheque_payment_handler(
    contract_id: int, data: PrContractChequePaymentDto, user: User, uow: UnitOfWork, prc_service: PRContractService
) -> ContractPayment:
    PAYMENT_TYPE = PaymentType.resolve(data.payment_type)
    STEP = PAYMENT_STEP_MAPPER[PAYMENT_TYPE]

    with uow:
        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        completed_steps = uow.contract_steps.get_contract_completed_steps(contract_id)

        tenant = uow.contract_parties.get(contract_id=contract_id, party_type=PartyType.TENANT)
        if not tenant:
            raise ProcessingException(processing_trans.both_parties_required_for_creating_payment)

        landlord = uow.contract_parties.get(contract_id=contract_id, party_type=PartyType.LANDLORD)
        if not landlord:
            raise ProcessingException(processing_trans.both_parties_required_for_creating_payment)

        party = tenant if tenant.user_id == user.id else landlord

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
            method=PaymentMethod.CHEQUE,
            type=PAYMENT_TYPE,
            due_date=data.due_date,
            owner_id=user.id,
        )

        image_file = uow.files.get_or_raise(id=data.image_file_id)

        payment.set_cheque(
            serial=data.serial,
            series=data.series,
            sayaad_code=data.sayaad_code,
            category=data.category,
            payee_type=data.payee_type,
            payee_national_code=data.payee_national_code,
            image_file_id=data.image_file_id,
        )

        uow.contract_payments.add(payment)

        image_file.is_used = True

        uow.commit()
        uow.contract_payments.refresh(payment)
        return payment
