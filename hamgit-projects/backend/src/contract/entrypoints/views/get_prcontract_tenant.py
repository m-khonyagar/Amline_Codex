from sqlalchemy import Row as SQLAlchemyRow
from sqlalchemy import text

from contract.domain import enums
from contract.service_layer.exceptions import (
    PartyIsNotTenantException,
    UserIsNotContractPartyException,
)
from core.types import CurrentUser
from unit_of_work import UnitOfWork


def get_prcontract_tenant_view(contract_id: int, current_user: CurrentUser, uow: UnitOfWork) -> dict:
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
            ba.id AS bank_account_id,
            ba.iban AS bank_account_iban,
            ba.owner_name AS bank_account_owner_name,
            prc.tenant_family_members_count AS tenant_family_members_count
        FROM contract.contract_parties cp
            JOIN contract.property_rent_contracts prc ON cp.contract_id = prc.contract_id
            JOIN account.users users ON cp.user_id = users.id
            LEFT JOIN account.bank_accounts ba ON prc.tenant_bank_account_id = ba.id
        WHERE cp.contract_id = :contract_id AND cp.user_id = :user_id
        """

        result: SQLAlchemyRow = uow.session.execute(
            text(query),
            {"contract_id": contract_id, "user_id": current_user.id},
        ).fetchone()

        if not result:
            raise UserIsNotContractPartyException

        result_dict = result._asdict()

        if result_dict["contract_party_type"] != enums.PartyType.TENANT:
            raise PartyIsNotTenantException

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
                type=enums.PartyType(result_dict["contract_party_type"]),
                user_role=result_dict["user_role"],
            ),
            bank_account=(
                dict(
                    id=str(result_dict["bank_account_id"]),
                    iban=result_dict["bank_account_iban"],
                    owner_name=result_dict["bank_account_owner_name"],
                )
                if result_dict["bank_account_id"]
                else None
            ),
            family_members_count=result_dict["tenant_family_members_count"],
        )
