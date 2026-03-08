from typing import Callable

from sqlalchemy import any_, desc, func, or_
from sqlalchemy.orm import aliased, selectinload

from account.domain.entities import User
from account.domain.entities.user_call import UserCall
from account.domain.enums import UserCallStatus, UserRole
from contract.domain.entities.contract_party import ContractParty
from core.types import PaginatedList, PaginateParams
from crm.domain.entities.file_label import FileLabel
from unit_of_work import UnitOfWork


def get_labels(uow: UnitOfWork, users: list[tuple[User, ContractParty, UserCall | None]]) -> Callable:
    all_label_ids = set()
    for user, _, _ in users:
        if user.label_ids:
            all_label_ids.update(user.label_ids)

    labels_dict = {}
    if all_label_ids:
        labels: list[FileLabel] = (
            uow.session.query(FileLabel).filter(FileLabel.id.in_(all_label_ids)).all()  # type: ignore
        )
        labels_dict = {label.id: label for label in labels}

    return lambda label_ids: (  # noqa: E731
        [labels_dict[label_id].dumps() for label_id in label_ids if label_id in labels_dict.keys()] if label_ids else []
    )


def get_users_list_view(
    params: PaginateParams,
    search_text: str | None,
    last_call_status: UserCallStatus | None,
    role: UserRole | None,
    uow: UnitOfWork,
) -> PaginatedList:
    with uow:
        latest_call_subquery = (
            uow.session.query(UserCall.user_id, func.max(UserCall.created_at).label("max_created_at"))
            .group_by(UserCall.user_id)
            .subquery()
        )

        LatestCall = aliased(UserCall)

        query = (
            uow.session.query(
                User,
                func.array_agg(func.distinct(ContractParty.party_type)).label("contract_party_types"),
                LatestCall.status,
            )
            .options(selectinload(User.wallet))  # type: ignore
            .outerjoin(ContractParty, ContractParty.user_id == User.id)
            .outerjoin(latest_call_subquery, User.id == latest_call_subquery.c.user_id)
            .outerjoin(
                LatestCall,
                (LatestCall.user_id == latest_call_subquery.c.user_id)
                & (LatestCall.created_at == latest_call_subquery.c.max_created_at),
            )
            .filter(
                User.deleted_at.is_(None),  # type: ignore
                or_(LatestCall.status == last_call_status, last_call_status is None),  # type: ignore
            )
            .group_by(User.id, LatestCall.status)
        )

        if search_text:
            query = query.filter(
                or_(
                    User.id == int(search_text) if search_text.isdigit() else False,  # type: ignore
                    User.mobile.ilike(f"%{search_text}%"),  # type: ignore
                    User.first_name.ilike(f"%{search_text}%"),  # type: ignore
                    User.last_name.ilike(f"%{search_text}%"),  # type: ignore
                    User.national_code.ilike(f"%{search_text}%"),  # type: ignore
                    func.concat(User.first_name, " ", User.last_name).ilike(f"%{search_text}%"),
                )
            )

        if role:
            query = query.filter(role.value == any_(User.roles))  # type: ignore

        total_count = query.count()

        query_result: list[tuple[User, ContractParty, UserCall | None]] = (
            query.order_by(desc(User.created_at)).limit(params.limit).offset(params.offset).all()  # type:ignore
        )
        labels_finder = get_labels(uow, query_result)
        data = [
            dict(
                **user.dumps(),
                contract_party=cp,
                last_call_status=call if call else None,
                labels=labels_finder(user.label_ids),
            )
            for user, cp, call in query_result
        ]

        return PaginatedList(
            total_count=total_count,
            data=data,
            start_index=params.offset,
            end_index=params.offset + len(query_result),
        )
