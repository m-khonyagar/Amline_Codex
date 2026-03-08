from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import ContractStatus, PartyType
from contract.domain.prcontract import PRContractService
from contract.domain.prcontract.steps_mapper import (
    COUNTER_PARTY_TYPE_MAPPER,
    SIGNATURE_STEP_MAPPER,
)
from contract.service_layer.dtos import VerifyPRContractPartyOtpSignDto
from core.helpers import get_now, get_otp_key
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import InvalidOtpCodeException
from shared.service_layer.services import CacheService
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def verify_prcontract_otp_sign_handler(
    contract_id: int,
    data: VerifyPRContractPartyOtpSignDto,
    uow: UnitOfWork,
    user: User,
    cache_service: CacheService,
    prc_service: PRContractService,
    sms_service: SMSService,
) -> ContractParty:

    otp_key = get_otp_key(mobile=user.mobile, otp_type=OtpType.SIGN_CONTRACT)

    try:
        cached_otp = cache_service.check_otp(otp_key, data.otp)

    except ValueError:
        raise InvalidOtpCodeException from None

    if not cached_otp:
        raise InvalidOtpCodeException

    with uow:
        contract = uow.contracts.get_or_raise(id=contract_id)
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)

        COUNTER_PARTY_TYPE = COUNTER_PARTY_TYPE_MAPPER[party.party_type]
        STEP_TYPE = SIGNATURE_STEP_MAPPER[party.party_type]

        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=STEP_TYPE, completed_steps=contract_steps
        )

        party.sign(signature_data={"otp_code": data.otp}, signed_at=get_now())

        uow.contract_steps.add_step(contract_id=prcontract.contract_id, type=STEP_TYPE)

        counter_party = uow.contract_parties.get_or_raise(contract_id=contract_id, party_type=COUNTER_PARTY_TYPE)

        counter_user = uow.users.get_or_raise(id=counter_party.user_id)

        # party is landlord and owner is landlord -> send invitation to tenant
        if party.party_type == PartyType.LANDLORD and prcontract.owner.party_type == PartyType.LANDLORD:
            sms_service.send_invitation_to_tenant(
                landlord_fullname=user.fullname, mobile=counter_user.mobile, contract_id=contract.id
            )

        # send sms to counter party
        else:
            sms_service.send_counter_party_signed(mobile=counter_user.mobile, contract_id=contract.id)

        if party.party_type == PartyType.LANDLORD:
            contract.update_status(ContractStatus.ACTIVE)

        elif party.party_type == PartyType.TENANT:
            contract.update_status(ContractStatus.PENDING_COMMISSION)

        prcontract.update_contract(contract)

        uow.commit()
        uow.contract_parties.refresh(party)
        return party
