from account.service_layer.services.token_service import TokenService
from unit_of_work import UnitOfWork


def generate_token_as_user_for_admin_handler(user_id: int, token_service: TokenService, uow: UnitOfWork):
    with uow:
        user = uow.users.get_or_raise(id=user_id)
        token = token_service.generate_access_token(user.id)

    return {"access_token": token, "user": user.dumps()}
