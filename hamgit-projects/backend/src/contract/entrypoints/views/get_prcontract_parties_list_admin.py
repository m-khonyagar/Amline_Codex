from account.domain.entities.user import User
from contract.domain.entities.contract_party import ContractParty
from contract.domain.enums import PartyType
from core.base.base_enum import BaseEnum
from unit_of_work import UnitOfWork


class BankAccountType(BaseEnum):
    RENT = "RENT"
    DEPOSIT = "DEPOSIT"


# FIXME -> use raw sql query
def get_prcontract_parties_list_admin_view(contract_id: int, uow: UnitOfWork):
    with uow:
        prc = uow.prcontracts.get_or_raise(contract_id=contract_id)

        _parties: list[tuple[ContractParty, User]] = (
            uow.session.query(ContractParty, User)
            .join(User, User.id == ContractParty.user_id)
            .filter(ContractParty.contract_id == contract_id, ContractParty.deleted_at.is_(None))  # type: ignore
            .all()
        )

        if not _parties:
            return {}

        tenant = None
        landlord = None
        tenant_ba: list = []
        landlord_ba: list = []

        if prc.tenant_bank_account_id:
            tenant_ba.append(uow.bank_accounts.get_or_raise(id=prc.tenant_bank_account_id).dumps(type=None))

        if prc.landlord_deposit_bank_account_id:
            landlord_ba.append(
                uow.bank_accounts.get_or_raise(id=prc.landlord_deposit_bank_account_id).dumps(
                    type=BankAccountType.DEPOSIT
                )
            )

        if prc.landlord_rent_bank_account_id:
            landlord_ba.append(
                uow.bank_accounts.get_or_raise(id=prc.landlord_rent_bank_account_id).dumps(type=BankAccountType.RENT)
            )

        for party, user in _parties:
            if party.party_type == PartyType.TENANT:
                user = user.dumps()
                del user["id"]
                tenant = party.dumps(**user, bank_accounts=tenant_ba)
            elif party.party_type == PartyType.LANDLORD:
                user = user.dumps()
                del user["id"]
                landlord = party.dumps(**user, bank_accounts=landlord_ba)

        return {"tenant": tenant, "landlord": landlord}
