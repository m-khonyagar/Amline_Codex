from sqlalchemy import Row as SQLAlchemyRow
from sqlalchemy import text

from account.domain.enums import UserRole
from contract.domain.enums import PartyType
from contract.service_layer.exceptions import (
    PartyIsNotLandlordException,
    UserIsNotContractPartyException,
)
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_prcontract_landlord_view(contract_id: int, current_user: CurrentUser, uow: UnitOfWork) -> dict:
    with uow:
        query = """
        SELECT cp.id AS contract_party_id,
            cp.party_type AS contract_party_type,
            cp.user_role AS user_role,
            users.id AS user_id,
            users.mobile AS user_mobile,
            users.national_code AS user_national_code,
            users.birth_date AS user_birth_date,
            users.first_name AS user_first_name,
            users.last_name AS user_last_name,
            users.father_name AS user_father_name,
            users.postal_code AS user_postal_code,
            users.address AS user_address,
            ba_rent.id AS landlord_rent_bank_account_id,
            ba_rent.iban AS landlord_rent_bank_account_iban,
            ba_rent.owner_name AS landlord_rent_bank_account_owner_name,
            ba_deposit.id AS landlord_deposit_bank_account_id,
            ba_deposit.iban AS landlord_deposit_bank_account_iban,
            ba_deposit.owner_name AS landlord_deposit_bank_account_owner_name
        FROM contract.contract_parties cp
            JOIN contract.property_rent_contracts prc ON cp.contract_id = prc.contract_id
            JOIN account.users users ON cp.user_id = users.id
            LEFT JOIN account.bank_accounts ba_rent ON prc.landlord_rent_bank_account_id = ba_rent.id
            LEFT JOIN account.bank_accounts ba_deposit ON prc.landlord_deposit_bank_account_id = ba_deposit.id
        WHERE cp.contract_id = :contract_id AND cp.user_id = :user_id
        """

        result: SQLAlchemyRow = uow.session.execute(
            text(query),
            {"contract_id": contract_id, "user_id": current_user.id},
        ).fetchone()

        if not result:
            raise UserIsNotContractPartyException

        result_dict = result._asdict()

        if result_dict["contract_party_type"] != PartyType.LANDLORD:
            raise PartyIsNotLandlordException

        return dict(
            user=dict(
                id=str(result_dict["user_id"]),
                mobile=result_dict["user_mobile"],
                national_code=result_dict["user_national_code"],
                birth_date=result_dict["user_birth_date"],
                first_name=result_dict["user_first_name"],
                last_name=result_dict["user_last_name"],
                father_name=result_dict["user_father_name"],
                postal_code=result_dict["user_postal_code"],
                address=result_dict["user_address"],
            ),
            party=dict(
                id=str(result_dict["contract_party_id"]),
                party_type=result_dict["contract_party_type"],
                user_role=UserRole.resolve(result_dict["user_role"]),
            ),
            rent_bank_account=dict(
                id=str(result_dict["landlord_rent_bank_account_id"]),
                iban=result_dict["landlord_rent_bank_account_iban"],
                owner_name=result_dict["landlord_rent_bank_account_owner_name"],
            ),
            deposit_bank_account=dict(
                id=str(result_dict["landlord_deposit_bank_account_id"]),
                iban=result_dict["landlord_deposit_bank_account_iban"],
                owner_name=result_dict["landlord_deposit_bank_account_owner_name"],
            ),
        )
