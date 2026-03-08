from core.enums import SortDirection
from core.types import CurrentUser, FilterCriteria, PaginatedList, PaginateParams
from unit_of_work import UnitOfWork


def get_user_wallet_transactions(uow: UnitOfWork, current_user: CurrentUser, params: PaginateParams):
    with uow:
        wallet = uow.wallets.get_or_raise(user_id=current_user.id)
        filters = [(FilterCriteria(field_names={"wallet_id"}, value=wallet.id))]
        params.sort_direction = SortDirection.DESC
        total_count, transactions = uow.wallet_transactions.get_all(params, filters)
        result = [t.dumps() for t in transactions]

        return PaginatedList(
            total_count=total_count,
            data=result,
            start_index=params.offset,
            end_index=params.offset + len(result),
        )
