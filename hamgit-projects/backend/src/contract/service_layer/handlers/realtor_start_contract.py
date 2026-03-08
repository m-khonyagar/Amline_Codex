from datetime import date
from typing import Protocol

from account.domain.entities.user import User
from contract.domain.entities import Contract, ContractParty, PropertyRentContract
from contract.domain.enums import (
    ContractStatus,
    ContractType,
    PartyType,
    PRContractStep,
)
from contract.domain.prcontract.clauses_generator import generate_clauses
from contract.service_layer.dtos import RealtorStartContractRequest
from core.exceptions import ValidationException
from shared.service_layer.services.user_verifier_service import UserVerifierService
from unit_of_work import UnitOfWork


class PartyDto(Protocol):
    mobile: str
    national_code: str
    birth_date: date


def verify_user_info(uow: UnitOfWork, verifier: UserVerifierService, data: PartyDto) -> User:
    user = uow.users.get_by_mobile(mobile=data.mobile)
    if not user:
        user = User(mobile=data.mobile)
        uow.users.add(user)
    if not user.is_verified:
        verified_data = verifier.verify_user_info(
            mobile=data.mobile, national_code=data.national_code, birth_date=data.birth_date
        )
        user.update(**verified_data)
    elif user.national_code != data.national_code or user.birth_date != data.birth_date:
        raise ValidationException("کد ملی یا تاریخ تولد صحیح نیست")
    return user


def realtor_start_contract_handler(
    data: RealtorStartContractRequest, verifier: UserVerifierService, uow: UnitOfWork, current_user: User
) -> dict:
    if not current_user.is_verified:
        raise ValidationException("لطفا برای ثبت قرارداد ابتدا اطلاعات خود را تایید کنید")
    with uow:
        landlord = verify_user_info(uow=uow, verifier=verifier, data=data.landlord)
        tenant = verify_user_info(uow=uow, verifier=verifier, data=data.tenant)

        contract = Contract(
            type=ContractType.PROPERTY_RENT,
            owner_user_id=landlord.id,
            status=ContractStatus.ADMIN_STARTED,
            created_by=current_user.id,
        )
        uow.contracts.add(contract)
        uow.flush()

        landlord_party = ContractParty(user_id=landlord.id, contract_id=contract.id, party_type=PartyType.LANDLORD)
        tenant_party = ContractParty(user_id=tenant.id, contract_id=contract.id, party_type=PartyType.TENANT)

        prcontract = PropertyRentContract(
            contract_id=contract.id,
            owner_user_id=landlord.id,
            owner_party_type=PartyType.LANDLORD,
            is_guaranteed=False,
            status=ContractStatus.ADMIN_STARTED,
        )
        uow.prcontracts.add(prcontract)

        clauses = generate_clauses(uow=uow, contract_id=contract.id, is_guaranteed=False)
        uow.contract_clauses.add_all(clauses)

        uow.contract_parties.add_all([landlord_party, tenant_party])

        uow.contract_steps.add_step(contract_id=contract.id, type=PRContractStep.ADD_COUNTER_PARTY)

        uow.commit()
        uow.contracts.refresh(contract)
        return contract.dumps()
