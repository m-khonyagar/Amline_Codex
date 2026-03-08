from account.service_layer.services import TokenService
from unit_of_work import UnitOfWork


def refresh_access_token_handler(refresh_token: str, uow: UnitOfWork, token_service: TokenService) -> dict:
    """Refresh access token and return new access and refresh tokens."""

    token_service.revoke_refresh_token(refresh_token)

    user = token_service.get_user_from_token(refresh_token)

    with uow:
        user = uow.users.get_or_raise(id=user.id)
        new_access_token = token_service.generate_access_token(user.id)
        new_refresh_token = token_service.generate_refresh_token(user.id)
        return dict(access_token=new_access_token, refresh_token=new_refresh_token)
