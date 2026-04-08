from account.domain.entities import BankAccount
from account.domain.entities.user import User
from account.domain.enums import UserRole
from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import PRContractStep
from contract.domain.prcontract import PRContractService
from contract.service_layer.dtos import UpsertPRContractTenantDto
from core.exceptions import ValidationException
from core.translates import validation_trans
from shared.service_layer.services import UserVerifierService
from unit_of_work import UnitOfWork


def upsert_prcontract_tenant_information_handler(
    contract_id: int,
    data: UpsertPRContractTenantDto,
    user: User,
    uow: UnitOfWork,
    user_verifier_service: UserVerifierService,
    prc_service: PRContractService,
) -> ContractParty:
    with uow:
        prcontract = uow.prcontracts.get_by_contract_id_or_raise(contract_id)
        party = uow.contract_parties.get_by_contract_id_and_user_or_raise(contract_id, user)
        contract_steps = uow.contract_steps.get_contract_completed_steps(contract_id)
        prc_service.validate_party_has_permission_for_step(
            prc=prcontract, party=party, step=PRContractStep.TENANT_INFORMATION, completed_steps=contract_steps
        )

        user = uow.users.get_or_raise(id=user.id)

        if counter_party := uow.contract_parties.get_counter_party(contract_id, party.id):
            counter_party_user = uow.users.get_or_raise(id=counter_party.user_id)
            prc_service.validate_party_and_counter_party_are_not_same(user, counter_party_user)

        if not user.is_verified:
            verification_result = user_verifier_service.verify_user_info(
                national_code=data.national_code, birth_date=data.birth_date, mobile=user.mobile
            )
            user.update(**verification_result, address=data.address, postal_code=data.postal_code)

        # validations
        elif user.is_verified and user.national_code != data.national_code:
            raise ValidationException(validation_trans.verified_user_cannot_change_national_code)

        elif user.is_verified and user.birth_date != user.birth_date:
            raise ValidationException(validation_trans.verified_user_cannot_change_birth_date)
        else:
            user.update(address=data.address, postal_code=data.postal_code)

        # Create or Update Bank Account
        bank_account = uow.bank_accounts.get_by_iban_and_user(
            iban=data.iban, user_id=user.id, user_role=UserRole.PERSON
        )

        if bank_account is None:
            bank_account = BankAccount(
                user_id=user.id,
                user_role=UserRole.PERSON,
                iban=data.iban,
                owner_name=data.iban_owner_name,
            )
            uow.bank_accounts.add(bank_account)
        elif bank_account.owner_name != data.iban_owner_name:
            bank_account.update(owner_name=data.iban_owner_name)

        # Add Bank Account to Property Rent Contract
        prcontract.add_tenant_bank_account(bank_account.id)

        # Add Tenant Information Step
        uow.contract_steps.add_step(contract_id=contract_id, type=PRContractStep.TENANT_INFORMATION)

        uow.commit()
        uow.contract_parties.refresh(party)

        return party
