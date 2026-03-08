from account.domain.entities.user import User
from account.service_layer.dtos import UserAuthDto, VerifyAuthenticationOtpDto
from account.service_layer.services import TokenService
from core import helpers, settings
from core.exceptions import PermissionException
from financial.domain.entities.wallet import Wallet
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import InvalidOtpCodeException, OtpExpiredException
from shared.service_layer.services import CacheService
from unit_of_work import UnitOfWork

from di import get_sms_service
from shared.domain.enums import SMSTemplates


def user_from_mobile(mobile: str, uow: UnitOfWork, eitaa_user_id: str | None = None) -> UserAuthDto:
    with uow:
        user = uow.users.get_by_mobile(mobile)

        if not user:
            user = User(mobile=mobile)
            uow.users.add(user)

            get_sms_service().send_sms(
                mobile, SMSTemplates.WELLCOME_MESSAGE.text
            )

        if (uow.wallets.get(user_id=user.id)) is None:
            uow.wallets.add(Wallet(0, user.id, int(settings.AMLINE_UID)))

        user.reset_last_login()
        user.eitaa_user_id = eitaa_user_id

        uow.commit()

        return UserAuthDto(id=user.id, mobile=user.mobile, is_admin=user.is_admin_panel_user)


def verify_otp(data: VerifyAuthenticationOtpDto, cache_service: CacheService):
    validated_mobile = helpers.validate_mobile_number(data.mobile)
    otp_key = helpers.get_otp_key(mobile=validated_mobile, otp_type=OtpType.AUTHENTICATION)

    try:
        cached_otp = cache_service.check_otp(otp_key, data.otp)

    except ValueError:
        raise InvalidOtpCodeException from None

    if not cached_otp:
        raise OtpExpiredException
        
    return validated_mobile


def create_token(user_id: int, token_service: TokenService) -> dict:
    return dict(
        access_token=token_service.generate_access_token(user_id),
        refresh_token=token_service.generate_refresh_token(user_id),
    )


def verify_authentication_otp_handler(
    data: VerifyAuthenticationOtpDto,
    cache_service: CacheService,
    uow: UnitOfWork,
    token_service: TokenService,
) -> dict:

    validated_mobile = verify_otp(data=data, cache_service=cache_service)
    user = user_from_mobile(mobile=validated_mobile, uow=uow)
    token = create_token(user_id=user.id, token_service=token_service)

    return token


def verify_admin_authentication_otp_handler(
    data: VerifyAuthenticationOtpDto,
    cache_service: CacheService,
    uow: UnitOfWork,
    token_service: TokenService,
) -> dict:

    validated_mobile = verify_otp(data=data, cache_service=cache_service)
    user = user_from_mobile(mobile=validated_mobile, uow=uow)
    if not user.is_admin:
        raise PermissionException
    token = create_token(user_id=user.id, token_service=token_service)

    return token


def verify_divar_authentication_handler(mobile: str, uow: UnitOfWork, token_service: TokenService):
    user = user_from_mobile(mobile=mobile, uow=uow)
    token = create_token(user_id=user.id, token_service=token_service)
    return token
