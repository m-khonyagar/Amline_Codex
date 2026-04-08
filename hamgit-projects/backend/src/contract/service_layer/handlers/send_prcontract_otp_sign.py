import datetime as dt

from contract.domain.enums import PartyType, PRContractStep
from contract.domain.prcontract import PRContractService
from core.helpers import generate_otp
from core.types import CurrentUser
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import OtpRateLimitExceededException
from shared.service_layer.services import CacheService, SMSService
from shared.service_layer.services.voip_otp_service import VoipOtpService
from unit_of_work import UnitOfWork


def send_prcontract_otp_sign_handler(
    contract_id: int,
    user: CurrentUser,
    uow: UnitOfWork,
    cache_service: CacheService,
    sms_service: SMSService,
    prc_service: PRContractService,
) -> None:

    otp = generate_otp(mobile=user.mobile, otp_type=OtpType.SIGN_CONTRACT)

    if cache_service.get(otp.key):
        raise OtpRateLimitExceededException

    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        step = (
            PRContractStep.LANDLORD_SIGNATURE
            if party.party_type == PartyType.LANDLORD
            else PRContractStep.TENANT_SIGNATURE
        )
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=step, completed_steps=contract_steps
        )

        other_party = uow.contract_parties.get_or_raise(
            contract_id=contract_id,
            party_type=PartyType.LANDLORD if party.party_type == PartyType.TENANT else PartyType.TENANT,
        )

        other_user = uow.users.get_or_raise(id=other_party.user_id)

        sms_service.send_sign_contract_otp(
            mobile=user.mobile,
            contract_id=contract_id,
            party_full_name=other_user.fullname_or_mobile,
            otp=otp.value,
        )

        cache_service.cache_otp(key=otp.key, otp=otp.value)



def call_prcontract__voip_otp_sign_handler(
    contract_id: int,
    user: CurrentUser,
    uow: UnitOfWork,
    cache_service: CacheService,
    voip_service: VoipOtpService,
    prc_service: PRContractService,
) -> None:

    otp = generate_otp(mobile=user.mobile, otp_type=OtpType.SIGN_CONTRACT)

    if cache_service.get(otp.key):
        raise OtpRateLimitExceededException

    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        step = (
            PRContractStep.LANDLORD_SIGNATURE
            if party.party_type == PartyType.LANDLORD
            else PRContractStep.TENANT_SIGNATURE
        )
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=step, completed_steps=contract_steps
        )

        other_party = uow.contract_parties.get_or_raise(
            contract_id=contract_id,
            party_type=PartyType.LANDLORD if party.party_type == PartyType.TENANT else PartyType.TENANT,
        )

        other_user = uow.users.get_or_raise(id=other_party.user_id)

        voip_service.call_otp(mobile=user.mobile , otp=otp.value)

        cache_service.cache_otp(key=otp.key, otp=otp.value)
