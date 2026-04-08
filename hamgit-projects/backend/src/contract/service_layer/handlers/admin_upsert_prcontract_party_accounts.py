from typing import List

from account.domain.entities import BankAccount
from contract.domain.enums import PartyType
from contract.domain.prcontract.steps_mapper import PARTY_STEP_MAPPER
from contract.service_layer.dtos import UpsertPRContractAccountsDto
from contract.service_layer.handlers.update_contract_party import (
    check_party_information_is_completed,
)
from core.exceptions import ValidationException
from core.translates import ValidationExcTrans
from unit_of_work import UnitOfWork


def admin_upsert_prcontract_party_accounts_handler(
    contract_id: int,
    party_id: int,
    uow: UnitOfWork,
    data: UpsertPRContractAccountsDto,
) -> List[BankAccount]:
    with uow:
        results = []

        prcontract = uow.prcontracts.get_or_raise(contract_id=contract_id)
        party = uow.contract_parties.get_or_raise(contract_id=contract_id, id=party_id)
        party_user = uow.users.get_or_raise(id=party.user_id)

        if party.party_type == PartyType.LANDLORD:
            bank_accounts = uow.bank_accounts.get_by_user_id(party.user_id)
            landlord_rent_ba = None

            if data.landlord_rent_iban and data.landlord_rent_iban_owner_name:
                landlord_rent_ba = handle_bank_account(
                    user_id=party.user_id,
                    bank_accounts=bank_accounts,
                    iban=data.landlord_rent_iban,
                    owner_name=data.landlord_rent_iban_owner_name,
                )

                uow.bank_accounts.add(landlord_rent_ba)
                prcontract.add_landlord_rent_bank_account(landlord_rent_ba.id)
                results.append(landlord_rent_ba)

            if data.landlord_deposit_iban and data.landlord_deposit_iban_owner_name:
                landlord_deposit_ba = handle_bank_account(
                    user_id=party.user_id,
                    bank_accounts=bank_accounts + [landlord_rent_ba],
                    iban=data.landlord_deposit_iban,
                    owner_name=data.landlord_deposit_iban_owner_name,
                )

                uow.bank_accounts.add(landlord_deposit_ba)
                prcontract.add_landlord_deposit_bank_account(landlord_deposit_ba.id)
                results.append(landlord_deposit_ba)

        if party.party_type == PartyType.TENANT:
            if data.tenant_iban and data.tenant_iban_owner_name:
                tenant_ba = handle_bank_account(
                    user_id=party.user_id,
                    bank_accounts=uow.bank_accounts.get_by_user_id(party.user_id),
                    iban=data.tenant_iban,
                    owner_name=data.tenant_iban_owner_name,
                )

                uow.bank_accounts.add(tenant_ba)
                prcontract.add_tenant_bank_account(tenant_ba.id)
                results.append(tenant_ba)

        if len(results) == 0:
            raise ValidationException(ValidationExcTrans.bank_account_not_provided)

        step = PARTY_STEP_MAPPER[party.party_type]
        if check_party_information_is_completed(prcontract, party_user, party):
            uow.contract_steps.add_step(contract_id, step)
        else:
            uow.contract_steps.revoke_step_if_exists(contract_id, step)

        uow.commit()

        for a in results:
            uow.bank_accounts.refresh(a)

        return results


def handle_bank_account(user_id: int, bank_accounts: list[BankAccount], iban: str, owner_name: str) -> BankAccount:
    ba_dict: dict[str, BankAccount] = {ba.iban: ba for ba in bank_accounts}
    ba = ba_dict.get(iban)
    if ba is None:
        ba = BankAccount(user_id=user_id, iban=iban, owner_name=owner_name)
    # TODO: update or raise ProcessingException
    elif ba.owner_name != owner_name:
        ba.update(owner_name=owner_name)
        # raise ProcessingException(ProcessingExcTrans.iban_exists_with_different_owner_name)
    return ba
