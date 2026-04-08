"""ADMIN ROUTE HANDLER"""

from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import PartyType
from contract.domain.prcontract.steps_mapper import PARTY_STEP_MAPPER
from contract.service_layer.dtos import UpdateContractPartyDto
from core.exceptions import ValidationException
from core.translates.validation_exception import ValidationExcTrans
from shared.service_layer.services.user_verifier_service import UserVerifierService
from unit_of_work import UnitOfWork


def update_contract_party_handler(
    contract_id: int, party_id: int, data: UpdateContractPartyDto, uow: UnitOfWork, verifier: UserVerifierService
) -> ContractParty:
    with uow:
        data.convert_empty_string_to_none()

        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        party = uow.contract_parties.get_or_raise(contract_id=contract_id, id=party_id)
        user = uow.users.get_or_raise(id=party.user_id)
        if user.is_verified:
            if data.national_code and data.national_code != user.national_code:
                raise ValidationException(ValidationExcTrans.verified_user_cannot_change_national_code)
            if data.birth_date and data.birth_date != user.birth_date:
                raise ValidationException(ValidationExcTrans.verified_user_cannot_change_birth_date)
        elif not user.is_verified and data.national_code and data.birth_date:
            verification_result = verifier.verify_user_info(
                national_code=data.national_code, birth_date=data.birth_date, mobile=user.mobile
            )
            # Update user data based on  verification result
            data.first_name = verification_result.get("first_name", data.first_name)
            data.last_name = verification_result.get("last_name", data.last_name)
            data.father_name = verification_result.get("father_name", data.father_name)

            user.update(**verification_result, address=data.address, postal_code=data.postal_code)

        user.update(**data.dumps())

        step = PARTY_STEP_MAPPER[party.party_type]
        if check_party_information_is_completed(prcontract, user, party):
            uow.contract_steps.add_step(contract_id, step)
        else:
            uow.contract_steps.revoke_step_if_exists(contract_id, step)

        uow.commit()
        uow.contract_parties.refresh(party)
        return party


def check_party_information_is_completed(prcontract: PropertyRentContract, user: User, party: ContractParty) -> bool:
    ba_completed = False
    if party.party_type == PartyType.TENANT:
        ba_completed = prcontract.tenant_bank_account_id is not None
    elif party.party_type == PartyType.LANDLORD:
        ba_completed = all(
            [
                prcontract.landlord_deposit_bank_account_id is not None,
                prcontract.landlord_rent_bank_account_id is not None,
            ]
        )
    return all([user.is_verified, ba_completed])
