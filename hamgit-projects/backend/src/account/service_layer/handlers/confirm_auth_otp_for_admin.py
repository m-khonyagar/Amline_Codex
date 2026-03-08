from account.service_layer.dtos import AdminLoginDto
from account.service_layer.services import TokenService
from core import helpers
from core.exceptions import AuthenticationException
from unit_of_work import UnitOfWork


def admin_login_handler(
    data: AdminLoginDto,
    uow: UnitOfWork,
    token_service: TokenService,
) -> dict:

    validated_mobile = helpers.validate_mobile_number(data.mobile)

    with uow:
        user = uow.users.get_or_raise(mobile=validated_mobile)

        if not user.is_admin_panel_user or user.national_code != data.national_code:
            raise AuthenticationException

        access_token = token_service.generate_access_token(user.id)
        refresh_token = token_service.generate_refresh_token(user.id)

        user.reset_last_login()
        uow.commit()

    return dict(access_token=access_token, refresh_token=refresh_token)
