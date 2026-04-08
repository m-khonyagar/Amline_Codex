from account.domain.entities import BankAccount, User
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import UpsertPRContractLandlordDto
from core.exceptions import ValidationException
from core.translates import validation_trans
from shared.service_layer.services import UserVerifierService
from unit_of_work import UnitOfWork


def upsert_prcontract_landlord_information_handler(
    contract_id: int,
    data: UpsertPRContractLandlordDto,
    user: User,
    uow: UnitOfWork,
    user_verifier_service: UserVerifierService,
    prc_service: PRContractService,
) -> dict:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=PRContractStep.LANDLORD_INFORMATION, completed_steps=contract_steps
        )

        if counter_party := uow.contract_parties.get_counter_party(contract_id, party.id):
            counter_party_user = uow.users.get_or_raise(id=counter_party.user_id)
            prc_service.validate_party_and_counter_party_are_not_same(user, counter_party_user)

        # validations
        if user.is_verified and user.national_code != data.national_code:
            raise ValidationException(validation_trans.verified_user_cannot_change_national_code)

        elif user.is_verified and user.birth_date != data.birth_date:
            raise ValidationException(validation_trans.verified_user_cannot_change_birth_date)

        user = uow.users.get_or_raise(id=user.id)

        if not user.is_verified:
            verification_result = user_verifier_service.verify_user_info(
                national_code=data.national_code, birth_date=data.birth_date, mobile=user.mobile
            )
            user.update(**verification_result, address=data.address, postal_code=data.postal_code)

        else:
            user.update(
                national_code=data.national_code,
                address=data.address,
                postal_code=data.postal_code,
                birth_date=data.birth_date,
            )

        # Create or Update Bank Accounts
        rent_ba, deposit_ba = handle_landlord_bank_accounts(
            user_id=user.id,
            bank_accounts=uow.bank_accounts.get_user_bank_accounts(user.id, user_roles=user.roles),
            rent_info=(data.rent_iban, data.rent_iban_owner_name),
            deposit_info=(data.deposit_iban, data.deposit_iban_owner_name),
        )
        uow.bank_accounts.add_all([rent_ba, deposit_ba])

        # Add Bank Accounts to Property Rent Contract
        prcontract.add_landlord_rent_bank_account(rent_ba.id)
        prcontract.add_landlord_deposit_bank_account(deposit_ba.id)

        # Add Landlord Information Step
        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.LANDLORD_INFORMATION)

        uow.commit()
        uow.contract_parties.refresh(party)

        return {
            "user": {
                "id": str(user.id),
                "mobile": user.mobile,
                "national_code": user.national_code,
                "birth_date": user.birth_date,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "father_name": user.father_name,
                "postal_code": user.postal_code,
                "address": user.address,
            },
            "party": {
                "id": str(party.id),
                "party_type": party.party_type,
                "user_role": party.user_role,
            },
            "rent_bank_account": {
                "id": str(rent_ba.id),
                "iban": rent_ba.iban,
                "owner_name": rent_ba.owner_name,
            },
            "deposit_bank_account": {
                "id": str(deposit_ba.id),
                "iban": deposit_ba.iban,
                "owner_name": deposit_ba.owner_name,
            },
        }


def handle_landlord_bank_accounts(
    user_id: int, bank_accounts: list[BankAccount], rent_info: tuple, deposit_info: tuple
) -> tuple[BankAccount, BankAccount]:
    """returns rent_bank_account, deposit_bank_account"""
    ba_dict: dict[str, BankAccount] = {ba.iban: ba for ba in bank_accounts}
    rent_iban, rent_owner_name = rent_info
    deposit_iban, deposit_owner_name = deposit_info

    rent = ba_dict.get(rent_iban)
    if rent is None or rent.iban != rent_iban:
        rent = BankAccount(user_id=user_id, iban=rent_iban, owner_name=rent_owner_name)
    elif rent.owner_name != rent_owner_name:
        rent.owner_name = rent_owner_name

    if rent_iban == deposit_iban:
        deposit = rent
    else:
        deposit = ba_dict.get(deposit_iban)
        if deposit is None or deposit.iban != deposit_iban:
            deposit = BankAccount(user_id=user_id, iban=deposit_iban, owner_name=deposit_owner_name)
        elif deposit.owner_name != deposit_owner_name:
            deposit.owner_name = deposit_owner_name

    return rent, deposit
