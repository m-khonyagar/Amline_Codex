from datetime import timedelta

from account.service_layer.dtos import SendAuthenticationOtpDto
from core.exceptions import AuthenticationException
from core.helpers import generate_otp, validate_mobile_number
from shared.domain.enums import OtpType
from shared.service_layer.exceptions import OtpRateLimitExceededException
from shared.service_layer.services.cache_service import CacheService
from shared.service_layer.services.sms_service import SMSService
from unit_of_work import UnitOfWork


def send_auth_otp_admin_login_handler(
    data: SendAuthenticationOtpDto, sms_service: SMSService, cache_service: CacheService, uow: UnitOfWork
) -> None:
    validate_mobile = validate_mobile_number(data.mobile)

    otp = generate_otp(mobile=validate_mobile, otp_type=OtpType.AUTHENTICATION)

    if cache_service.get(otp.key):
        raise OtpRateLimitExceededException

    with uow:
        user = uow.users.get_by_mobile(validate_mobile)
        if not user:
            raise AuthenticationException

        if not user.is_admin_panel_user:
            raise AuthenticationException

    sms_service.send_otp(mobile=validate_mobile, otp=otp.value)

    cache_service.cache_otp(key=otp.key, otp=otp.value)
