from account.domain.enums import UserRole
from contract.entrypoints.query_params import PRContractQueryParams
from core.types import CurrentUser, PaginateParams
from unit_of_work import UnitOfWork


def get_prcontracts_list_view(
    paginate_params: PaginateParams,
    query_params: PRContractQueryParams,
    uow: UnitOfWork,
    current_user: CurrentUser,
) -> dict:
    params = {
        "limit": paginate_params.limit,
        "offset": paginate_params.offset,
        "status": query_params.status,
        "search_phrase": query_params.search_phrase,
        "created_by": current_user.id if UserRole.CONTRACT_ADMIN in current_user.roles else None,
        "is_auditor": True if UserRole.AUDITOR in current_user.roles else False,
        "contract_admin": query_params.contract_admin,
        "color": query_params.color,
    }

    base_q = """
        SELECT prc.contract_id::text AS id,
            prc.owner_party_type owner_type,
            prc.date date,
            prc.property_handover_date handover_date,
            prc.start_date start_date,
            prc.end_date end_date,
            prc.deposit_amount deposit,
            prc.rent_amount rent,
            prc.status status,
            prc.created_at created_at,
            prc.color color,
            json_agg(
                json_build_object(
                    'user_id',
                    u.id::text,
                    'party_type',
                    cp.party_type,
                    'first_name',
                    u.first_name,
                    'last_name',
                    u.last_name,
                    'mobile',
                    u.mobile,
                    'national_code',
                    u.national_code,
                    'birth_date',
                    u.birth_date
                )
            ) parties
        FROM contract.property_rent_contracts prc
            JOIN contract.contracts c on prc.contract_id = c.id
            LEFT JOIN contract.contract_parties cp ON prc.contract_id = cp.contract_id
            and cp.deleted_at is null
            JOIN account.users u ON cp.user_id = u.id
        WHERE prc.deleted_at is NULL
            AND (
                prc.status = :status
                OR :status IS NULL
            )
            AND (
                prc.color = :color
                OR :color IS NULL
            )
            AND (
                c.created_by = :created_by
                OR :created_by IS NULL
            )
            AND (
                (prc.tracking_code_value IS NOT NULL AND prc.tracking_code_generation_date IS NOT NULL)
                OR :is_auditor IS FALSE
            )
            AND prc.contract_id IN (
                SELECT cp.contract_id
                FROM contract.contract_parties cp
                    JOIN account.users u ON cp.user_id = u.id
                WHERE cp.deleted_at IS NULL
                    AND u.first_name ILIKE :search_phrase
                    OR u.last_name ILIKE :search_phrase
                    OR u.first_name || ' ' || u.last_name ILIKE :search_phrase
                    OR :search_phrase IS NULL
            )
            AND (
                prc.contract_id IN (
                    SELECT c.id
                    FROM CONTRACT.contracts c
                        JOIN "account".users u ON c.created_by = u.id
                    WHERE 'CONTRACT_ADMIN' = ANY(u.roles)
                )
                OR :contract_admin IS FALSE
            )
    """

    contract_ids = get_user_contract_ids(query_params.mobile, uow) if query_params.mobile else None
    contract_ids = [query_params.contract_id] if query_params.contract_id else contract_ids

    # if contract_ids:
    #     base_q += " AND prc.contract_id = ANY(:contract_ids)"
    #     params["contract_ids"] = contract_ids

    #     count_q = "SELECT COUNT(*) FROM (" + base_q + "GROUP BY prc.id) AS count_query"
    #     total_count = uow.fetchone(count_q, **params)["count"]  # type: ignore

    #     q = base_q + "GROUP BY prc.id ORDER BY prc.created_at DESC LIMIT :limit OFFSET :offset"

    #     result = uow.fetchall(q, **params)

    # else:
    #     total_count, result = 0, []

    if contract_ids:
        base_q += " AND prc.contract_id = ANY(:contract_ids)"
        params["contract_ids"] = contract_ids

    count_q = "SELECT COUNT(*) FROM (" + base_q + "GROUP BY prc.id) AS count_query"
    total_count = uow.fetchone(count_q, **params)["count"]  # type: ignore

    q = base_q + "GROUP BY prc.id ORDER BY prc.created_at DESC LIMIT :limit OFFSET :offset"

    result = uow.fetchall(q, **params)


    return {
        "total_count": total_count,
        "start_index": paginate_params.offset,
        "end_index": paginate_params.offset + len(result),
        "data": result,
    }


def get_user_contract_ids(user_mobile: str, uow: UnitOfWork) -> list[int]:
    query = """
    SELECT cp.contract_id id FROM contract.contract_parties cp
    JOIN "account".users u ON cp.user_id = u.id
    WHERE u.mobile = :mobile AND cp.deleted_at is NULL
    """
    result = uow.fetchall(query, mobile=user_mobile)
    return [r["id"] for r in result]
