from sqlalchemy import text

from unit_of_work import UnitOfWork


def get_user_stats(user_id: int, uow: UnitOfWork):
    with uow:
        query = text(
            """
        SELECT
            COUNT(DISTINCT CASE WHEN c.status = 'ADMIN_APPROVED'
             AND c.deleted_at IS NULL THEN c.id END) AS completed_contracts_count,
            COUNT(DISTINCT CASE WHEN wa.deleted_at IS NULL THEN wa.id END)
             AS registered_requirements_count,
            COUNT(DISTINCT CASE WHEN wa.status = 'PUBLISHED'
             AND wa.deleted_at IS NULL THEN wa.id END) AS accepted_requirements_count,
            COUNT(DISTINCT CASE WHEN wa.status = 'REJECTED'
             AND wa.deleted_at IS NULL THEN wa.id END) AS rejected_requirements_count,
            COUNT(DISTINCT CASE WHEN wa.status = 'PUBLISHED'
             AND wa.created_by_admin IS TRUE AND wa.deleted_at IS NULL THEN wa.id END)
             AS admin_made_requirements_count
        FROM
            contract.contract_parties cp
            LEFT JOIN contract.contracts c ON c.id = cp.contract_id
            FULL OUTER JOIN advertisement.property_wanted_ads wa ON wa.user_id = cp.user_id
        WHERE
            cp.user_id = :user_id OR wa.user_id = :user_id
        """
        )

        result = uow.session.execute(query, {"user_id": user_id}).fetchone()

        return {
            "completed_contracts_count": result.completed_contracts_count or 0,
            "registered_requirements_count": result.registered_requirements_count or 0,
            "accepted_requirements_count": result.accepted_requirements_count or 0,
            "rejected_requirements_count": result.rejected_requirements_count or 0,
            "admin_made_requirements_count": result.admin_made_requirements_count or 0,
        }
