"""ADMIN ROUTES HANDLER"""

from datetime import timedelta

from contract.domain.entities.contract_party import ContractParty
from contract.domain.entities.contract_step import ContractStep
from contract.domain.enums import PartyType, PRContractStep
from contract.domain.prcontract.steps_mapper import SIGNATURE_STEP_MAPPER
from contract.service_layer.dtos import (
    SignContractForPartyDto,
    VerifyPRContractPartyOtpSignDto,
)
from core.exceptions import ProcessingException
from core.helpers import generate_otp, get_now, get_otp_key
from core.translates.processing_exception import ProcessingExcTrans
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import InvalidOtpCodeException
from shared.service_layer.services.cache_service import CacheService
from shared.service_layer.services.sms_service import SMSService
from shared.service_layer.services.voip_otp_service import VoipOtpService
from unit_of_work import UnitOfWork


def send_contract_sign_otp_handler(
    contract_id: int, party_id: int, uow: UnitOfWork, sms_service: SMSService, cache: CacheService
):
    with uow:
        check_perm(uow.contract_steps.get_contract_completed_steps(contract_id))
        party = uow.contract_parties.get_or_raise(id=party_id, contract_id=contract_id)
        if party.has_been_signed:
            raise ProcessingException("Party has already signed the contract")
        user = uow.users.get_or_raise(id=party.user_id)
        other_party = uow.contract_parties.get_or_raise(
            contract_id=contract_id,
            party_type=PartyType.LANDLORD if party.party_type == PartyType.TENANT else PartyType.TENANT,
        )
        other_user = uow.users.get_or_raise(id=other_party.user_id)
        otp = generate_otp(mobile=user.mobile, otp_type=OtpType.SIGN_CONTRACT)
        sms_service.send_sign_contract_otp(
            mobile=user.mobile,
            otp=otp.value,
            party_full_name=other_user.fullname_or_mobile,
            contract_id=contract_id,
        )
        cache.cache_otp(key=otp.key, otp=otp.value)



def voip_call_contract_sign_otp_handler(
    contract_id: int, party_id: int, uow: UnitOfWork, voip_service: VoipOtpService, cache: CacheService
):
    with uow:
        check_perm(uow.contract_steps.get_contract_completed_steps(contract_id))
        party = uow.contract_parties.get_or_raise(id=party_id, contract_id=contract_id)
        if party.has_been_signed:
            raise ProcessingException("Party has already signed the contract")
        user = uow.users.get_or_raise(id=party.user_id)
        other_party = uow.contract_parties.get_or_raise(
            contract_id=contract_id,
            party_type=PartyType.LANDLORD if party.party_type == PartyType.TENANT else PartyType.TENANT,
        )
        other_user = uow.users.get_or_raise(id=other_party.user_id)
        otp = generate_otp(mobile=user.mobile, otp_type=OtpType.SIGN_CONTRACT)
        voip_service.call_otp(mobile= user.mobile, otp= otp.value)
        cache.cache_otp(key=otp.key, otp=otp.value)


def confirm_contract_sign_otp_handler(
    contract_id: int, party_id: int, data: VerifyPRContractPartyOtpSignDto, uow: UnitOfWork, cache: CacheService
) -> ContractParty:
    with uow:
        check_perm(uow.contract_steps.get_contract_completed_steps(contract_id))
        party = uow.contract_parties.get_or_raise(id=party_id, contract_id=contract_id)
        user = uow.users.get_or_raise(id=party.user_id)
        otp_key = get_otp_key(mobile=user.mobile, otp_type=OtpType.SIGN_CONTRACT)

        try:
            cached_otp = cache.check_otp(otp_key, data.otp)

        except ValueError:
            raise InvalidOtpCodeException from None

        if not cached_otp:
            raise InvalidOtpCodeException

        party.sign(signature_data={"otp_code": data.otp, "signed_in": "admin-panel"}, signed_at=get_now())

        step = SIGNATURE_STEP_MAPPER[party.party_type]
        uow.contract_steps.add_step(contract_id=contract_id, type=step)

        uow.commit()
        uow.contract_parties.refresh(party)
        return party


def sign_contract_for_party_handler(
    contract_id: int, party_id: int, data: SignContractForPartyDto, uow: UnitOfWork
) -> ContractParty:
    with uow:
        DEFAULT_OTP = "00000"
        party = uow.contract_parties.get_or_raise(id=party_id, contract_id=contract_id)
        if party.has_been_signed:
            raise ProcessingException("Party has already signed the contract")
        check_perm(uow.contract_steps.get_contract_completed_steps(contract_id))

        otp = data.otp or DEFAULT_OTP
        party.sign(signature_data={"otp_code": otp, "signed_in": "admin-panel"}, signed_at=data.sign_date or get_now())

        step = SIGNATURE_STEP_MAPPER[party.party_type]
        uow.contract_steps.add_step(contract_id=contract_id, type=step)

        uow.commit()
        uow.contract_parties.refresh(party)
        return party


# FIXME => Move this function to prc-service
def check_perm(completed_steps: list[ContractStep]) -> None:
    steps = {PRContractStep.resolve(step.type) for step in completed_steps}

    required_steps = {
        PRContractStep.DATES_AND_PENALTIES,
        PRContractStep.MONTHLY_RENT,
        PRContractStep.DEPOSIT,
        PRContractStep.ADD_COUNTER_PARTY,
        PRContractStep.TENANT_INFORMATION,
        PRContractStep.LANDLORD_INFORMATION,
        #
        PRContractStep.RENT_PAYMENT,
        PRContractStep.DEPOSIT_PAYMENT,
        #
        PRContractStep.PROPERTY_DETAILS,
        PRContractStep.PROPERTY_FACILITIES,
        PRContractStep.PROPERTY_SPECIFICATIONS,
    }

    missing_steps = required_steps - steps

    if missing_steps:
        raise ProcessingException(ProcessingExcTrans.some_steps_are_missing, location=list(missing_steps))
