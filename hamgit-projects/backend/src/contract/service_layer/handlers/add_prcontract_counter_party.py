import datetime as dt

from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import AddPRContractCounterPartyDto
from core.exceptions import PermissionException, ValidationException
from core.helpers import validate_mobile_number
from core.translates import perm_trans, validation_trans
from shared.service_layer.services import UserVerifierService
from unit_of_work import UnitOfWork


def add_prcontract_counter_party_handler(
    contract_id: int,
    data: AddPRContractCounterPartyDto,
    user: User,
    uow: UnitOfWork,
    user_verifier_service: UserVerifierService,
    prc_service: PRContractService,
) -> dict:
    with uow:
        validate_mobile = validate_mobile_number(data.mobile)

        # check if contract exists and belongs to the user
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)

        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=PRContractStep.ADD_COUNTER_PARTY
        )

        # check if user is trying to add himself as counter party
        if data.mobile == user.mobile or data.national_code == user.national_code:
            raise PermissionException(perm_trans.contract_parties_cant_be_the_same)

        _user = uow.users.get(mobile=validate_mobile)
        if not _user:
            _user = User(mobile=validate_mobile, national_code=data.national_code)
            uow.users.add(_user)
            uow.flush()

        # check if counter party already added
        counter_party = uow.contract_parties.get_counter_party(contract_id, party.id)

        if counter_party and counter_party.user_id == _user.id:
            _user = uow.users.get_or_raise(id=counter_party.user_id)

        elif counter_party and counter_party.user_id != _user.id:
            counter_party.deleted_at = dt.datetime.now(tz=dt.timezone.utc)
            counter_party = None

        # check mobile and national code are for the same person
        if not _user.is_verified:
            user_verifier_service.verify_mobile_ownership(data.mobile, data.national_code)

            # if user is not verified, update national code
            if _user.national_code != data.national_code:
                _user.national_code = data.national_code

        # check if user is already verified and trying to add another national code
        if _user.is_verified and _user.national_code != data.national_code:
            raise ValidationException(validation_trans.mobile_belongs_to_another_national_code)

        if not counter_party:
            counter_party = ContractParty(
                contract_id=contract_id,
                user_id=_user.id,
                party_type=prcontract.counter_party_type,
            )

            uow.contract_parties.add(counter_party)

        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.ADD_COUNTER_PARTY)

        uow.commit()

        return {
            "party_type": counter_party.party_type,
            "mobile": _user.mobile,
            "national_code": _user.national_code,
        }
