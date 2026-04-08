from account.domain.entities.bank_account import BankAccount
from contract.domain.entities.contract import Contract
from contract.domain.entities.contract_party import ContractParty
from contract.domain.entities.property_rent_contract import PropertyRentContract
from contract.domain.enums import (
    ContractStatus,
    ContractType,
    PartyType,
    PRContractStep,
)
from contract.domain.prcontract.clauses_generator import generate_clauses
from contract.service_layer.dtos import CreatePRContractDto
from core.exceptions import ProcessingException
from core.translates.processing_exception import ProcessingExcTrans
from unit_of_work import UnitOfWork


def create_prcontract_handler(data: CreatePRContractDto, uow: UnitOfWork) -> PropertyRentContract:
    with uow:
        landlord = uow.users.get_or_raise(id=data.landlord_user_id)
        tenant = uow.users.get_or_raise(id=data.tenant_user_id)

        contract = Contract(
            owner_user_id=landlord.id,
            status=ContractStatus.ADMIN_STARTED,
            type=ContractType.PROPERTY_RENT,
            created_by=landlord.id,
        )
        uow.contracts.add(contract)
        uow.flush()

        prcontract = PropertyRentContract(
            contract_id=contract.id,
            owner_user_id=landlord.id,
            owner_party_type=PartyType.LANDLORD,
            status=ContractStatus.ADMIN_STARTED,
            date=data.date,
            start_date=data.start_date,
            end_date=data.end_date,
            rent_amount=data.rent_amount,
            rent_day=data.rent_day,
            deposit_amount=data.deposit_amount,
            property_handover_date=data.property_handover_date,
            tenant_penalty_fee=data.tenant_penalty_fee,
            landlord_penalty_fee=data.landlord_penalty_fee,
            tenant_family_members_count=data.tenant_family_members_count,
            is_guaranteed=data.is_guaranteed,
        )

        landlord_party = ContractParty(contract_id=contract.id, user_id=landlord.id, party_type=PartyType.LANDLORD)
        tenant_party = ContractParty(contract_id=contract.id, user_id=tenant.id, party_type=PartyType.TENANT)
        uow.contract_parties.add(landlord_party)
        uow.contract_parties.add(tenant_party)

        landlord_rent_ba, landlord_deposit_ba = handle_landlord_bank_accounts(
            user_id=landlord.id,
            bank_accounts=uow.bank_accounts.get_user_bank_accounts(landlord.id, landlord.roles),
            rent_info=(data.landlord_rent_iban, data.landlord_rent_iban_owner_name),
            deposit_info=(data.landlord_deposit_iban, data.landlord_deposit_iban_owner_name),
        )

        tenant_ba = handle_tenant_bank_account(
            user_id=tenant.id,
            bank_accounts=uow.bank_accounts.get_by_user_id(tenant.id),
            iban=data.tenant_iban,
            owner_name=data.tenant_iban_owner_name,
        )

        uow.bank_accounts.add(landlord_rent_ba)
        uow.bank_accounts.add(landlord_deposit_ba)
        uow.bank_accounts.add(tenant_ba)

        prcontract.add_landlord_deposit_bank_account(landlord_deposit_ba.id)
        prcontract.add_landlord_rent_bank_account(landlord_rent_ba.id)
        prcontract.add_tenant_bank_account(tenant_ba.id)
        uow.prcontracts.add(prcontract)

        # Add default clauses
        clauses = generate_clauses(uow=uow, contract_id=contract.id, is_guaranteed=prcontract.is_guaranteed)

        uow.contract_clauses.add_all(clauses)

        steps_to_add = [
            PRContractStep.DATES_AND_PENALTIES,
            PRContractStep.MONTHLY_RENT,
            PRContractStep.DEPOSIT,
            PRContractStep.ADD_COUNTER_PARTY,
            PRContractStep.TENANT_INFORMATION,
            PRContractStep.LANDLORD_INFORMATION,
        ]

        for step in steps_to_add:
            uow.contract_steps.add_step(contract_id=contract.id, type=step)

        uow.commit()
        uow.prcontracts.refresh(prcontract)
        return prcontract


def handle_landlord_bank_accounts(
    user_id: int, bank_accounts: list[BankAccount], rent_info: tuple, deposit_info: tuple
) -> tuple[BankAccount, BankAccount]:
    """returns rent_bank_account, deposit_bank_account"""
    ba_dict: dict[str, BankAccount] = {ba.iban: ba for ba in bank_accounts}
    rent_iban, rent_owner_name = rent_info
    deposit_iban, deposit_owner_name = deposit_info

    if rent_iban == deposit_iban:
        ba = ba_dict.get(rent_iban)
        if ba is None:
            rent = deposit = BankAccount(user_id=user_id, iban=rent_iban, owner_name=rent_owner_name)
        else:
            rent = deposit = ba

    else:
        rent = ba_dict.get(rent_iban)
        if rent is None:
            rent = BankAccount(user_id=user_id, iban=rent_iban, owner_name=rent_owner_name)

        deposit = ba_dict.get(deposit_iban)
        if deposit is None:
            deposit = BankAccount(user_id=user_id, iban=deposit_iban, owner_name=deposit_owner_name)

    if rent.owner_name != rent_owner_name:
        raise ProcessingException(ProcessingExcTrans.iban_exists_with_different_owner_name)
    if deposit.owner_name != deposit_owner_name:
        raise ProcessingException(ProcessingExcTrans.iban_exists_with_different_owner_name)

    return rent, deposit


def handle_tenant_bank_account(
    user_id: int, bank_accounts: list[BankAccount], iban: str, owner_name: str
) -> BankAccount:
    ba_dict: dict[str, BankAccount] = {ba.iban: ba for ba in bank_accounts}
    ba = ba_dict.get(iban)
    if ba is None:
        ba = BankAccount(user_id=user_id, iban=iban, owner_name=owner_name)
    elif ba.owner_name != owner_name:
        raise ProcessingException(ProcessingExcTrans.iban_exists_with_different_owner_name)
    return ba
