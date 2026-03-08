from account.domain.entities.user import User
from account.domain.entities.user_call import UserCall
from account.entrypoints.request_models import UserCallCreateRequest
from unit_of_work import UnitOfWork


def create_user_call_handler(data: UserCallCreateRequest, uow: UnitOfWork, current_user: User) -> dict:
    with uow:
        user_call = UserCall(
            user_id=data.user_id,
            description=data.description,
            status=data.status,
            created_by=current_user.id,
            type=data.type,
        )
        uow.user_calls.add(user_call)
        uow.commit()
        uow.user_calls.refresh(user_call)
        return user_call.dumps()
